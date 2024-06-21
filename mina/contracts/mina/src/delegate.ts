import {
  Field,
  SmartContract,
  method,
  Bool,
  state,
  State,
  Poseidon,
  Struct,
  Provable,
  PublicKey,
  ZkProgram,
  MerkleMap,
  createEcdsa,
  createForeignCurve,
  Crypto,
  Bytes,
  UInt8,
  MerkleMapWitness,
} from 'o1js';

export class Secp256k1 extends createForeignCurve(Crypto.CurveParams.Secp256k1) {
  /** Convert a standard 0x04{128 hex digits} public key into this provable struct. */
  static fromHex(publicKey: `0x${string}`): Secp256k1 {
    if (!publicKey.startsWith('0x04') || publicKey.length != 4 + 64 + 64) {
      throw new Error('Bad public key format');
    }
    return Secp256k1.from({
      x: BigInt('0x' + publicKey.substring(4, 4 + 64)),
      y: BigInt('0x' + publicKey.substring(4 + 64, 4 + 64 + 64)),
    });
  }
}
export class Ecdsa extends createEcdsa(Secp256k1) {
  // o1js-provided fromHex is good enough
}


const ethereumPrefix = Bytes.fromString('\x19Ethereum Signed Message:\n');
const delegationPrefix = Bytes.fromString('MinaDelegate|');

export class DelegationOrder extends Struct({
  /** Mina public key that the delegation order is issued for. */
  target: PublicKey,
  /** Ethereum public key that signed the delegation order. */
  signer: Secp256k1.provable,
}) {
  private _innerMessage(): Bytes {
    return Bytes.from([
      ...delegationPrefix.bytes,
      ...encodeKey(this.target),
    ]);
  }

  /** Get the message for an Etherum wallet to sign, WITHOUT the Ethereum prefix. */
  bytesToSign(): Uint8Array {
    return this._innerMessage().toBytes();
  }

  /** Validate that the given Ethereum signature matches this order, WITH the Ethereum prefix. */
  assertSignatureMatches(signature: Ecdsa) {
    const inner = this._innerMessage();
    const fullMessage = Bytes.from([
      ...ethereumPrefix.bytes,
      ...Bytes.fromString(String(inner.length)).bytes,
      ...inner.bytes,
    ]);
    signature.verifyV2(fullMessage, this.signer).assertTrue();
  }
}

function boolToU8(bool: Bool): UInt8 {
  return UInt8.from(bool.toField());
}

export function encodeKey(k: PublicKey): UInt8[] {
  const bytes = [boolToU8(k.isOdd)];
  const bits = k.x.toBits(/* implied 254 */);
  for (let i = 0; i < bits.length; i += 8) {
    let value = new UInt8(0);
    for (let j = 0; j < 8; j++) {
      value = value.mul(2).add(boolToU8(bits[i + j] ?? Bool(false)));
    }
    bytes.push(value);
  }
  return bytes;
}


export const DelegateProgram = ZkProgram({
  name: 'DelegateProgram',

  publicInput: DelegationOrder,

  methods: {
    sign: {
      privateInputs: [Ecdsa.provable],

      async method(
        order: DelegationOrder,
        signature: Ecdsa,
      ) {
        order.assertSignatureMatches(signature);
      }
    }
  }
});
export class DelegateProof extends ZkProgram.Proof(DelegateProgram) {}


export const DelegateVerifyProgram = ZkProgram({
  name: 'DelegateVerifyProgram',

  publicOutput: DelegationOrder,

  methods: {
    check: {
      privateInputs: [DelegateProof],

      async method(
        proof: DelegateProof
      ): Promise<DelegationOrder> {
        Provable.asProver(() => console.time('proof.verify'));
        proof.verify();
        Provable.asProver(() => console.timeEnd('proof.verify'));
        return proof.publicInput;
      }
    }
  }
});


export const NoOpProgram = ZkProgram({
  name: 'NoOpProgram',

  publicOutput: DelegationOrder,

  methods: {
    blah: {
      privateInputs: [DelegationOrder],

      async method(
        order: DelegationOrder
      ): Promise<DelegationOrder> {
        // NO ASSERTIONS!
        return order;
      }
    }
  }
});


function hashMinaPubKey(minaKey: PublicKey): Field {
  return Poseidon.hashWithPrefix("delegate EVM to Mina", minaKey.toFields());
}

function hashEthAddress(ethAddress: Secp256k1): Field {
  return Poseidon.hash([
    ...ethAddress.x.toFields(),
    ...ethAddress.y.toFields(),
  ]);
}

export class WitnessPair extends Struct({
  outerWitness: MerkleMapWitness,
  innerWitness: MerkleMapWitness,
}) {}

export class TwoTier {
  outerMap = new MerkleMap();
  innerMaps = new Map<bigint, MerkleMap>();

  delegate(order: DelegationOrder): WitnessPair | undefined {
    const outerKey = hashEthAddress(order.signer);
    const innerKey = hashMinaPubKey(order.target);

    const innerMap = this.innerMaps.get(outerKey.toBigInt()) ?? new MerkleMap();
    if (innerMap.get(innerKey).equals(1).toBoolean())
      return undefined;

    innerMap.set(innerKey, Field(1));

    const newInnerRoot = innerMap.getRoot();
    this.outerMap.set(outerKey, newInnerRoot);

    return new WitnessPair({
      outerWitness: this.outerMap.getWitness(outerKey),
      innerWitness: innerMap.getWitness(innerKey),
    });
  }

  check(order: DelegationOrder): WitnessPair | undefined {
    const outerKey = hashEthAddress(order.signer);
    const innerKey = hashMinaPubKey(order.target);

    const innerMap = this.innerMaps.get(outerKey.toBigInt());
    if (!innerMap)
      return undefined;

    if (innerMap.get(innerKey).equals(0).toBoolean())
      return undefined;

    return new WitnessPair({
      outerWitness: this.outerMap.getWitness(outerKey),
      innerWitness: innerMap.getWitness(innerKey),
    });
  }
}


const emptyMapRoot = new MerkleMap().getRoot();


export class DelegationZkApp extends SmartContract {
  @state(Field) treeRoot = State<Field>(emptyMapRoot);

  static events = {
    "delegate": DelegationOrder,
  } as const;
  events = DelegationZkApp.events;

  @method async delegate(
    order: DelegationOrder,
    evmSignature: Ecdsa,
    pair: WitnessPair,
  ) {
    Provable.log('target', order.target.toFields());

    // Firstly, check EVM signature.
    order.assertSignatureMatches(evmSignature);

    // Assert that the witnesses match our idea of the old (0, false) value.
    const [oldInnerRoot, innerKey] = pair.innerWitness.computeRootAndKey(Field(0));
    // If the old inner tree was empty, it was 0 in the outer tree, not its real root.
    const oldOuterValue = Provable.if(oldInnerRoot.equals(emptyMapRoot), Field(0), oldInnerRoot);
    const [oldOuterRoot, outerKey] = pair.outerWitness.computeRootAndKey(oldOuterValue);
    innerKey.assertEquals(hashMinaPubKey(order.target));
    outerKey.assertEquals(hashEthAddress(order.signer));
    this.treeRoot.getAndRequireEquals().assertEquals(oldOuterRoot);

    // Update to the new (1, true) value.
    const [newInnerRoot,] = pair.innerWitness.computeRootAndKey(Field(1));
    const [newOuterRoot,] = pair.outerWitness.computeRootAndKey(newInnerRoot);
    this.treeRoot.set(newOuterRoot);

    this.emitEvent("delegate", order);
  }

  @method async check(
    order: DelegationOrder,
    pair: WitnessPair,
  ) {
    Provable.log('target', order.target.toFields());

    // Assert that the witnesses match our idea of the (1, true) value.
    const [innerRoot, innerKey] = pair.innerWitness.computeRootAndKey(Field(1));
    const [outerRoot, outerKey] = pair.outerWitness.computeRootAndKey(innerRoot);
    innerKey.assertEquals(hashMinaPubKey(order.target));
    outerKey.assertEquals(hashEthAddress(order.signer));
    this.treeRoot.getAndRequireEquals().assertEquals(outerRoot);
  }
}

export class UsesDelegationZkApp extends SmartContract {
  @method async viaRecursiveProof(
    proof: DelegateProof,
  ) {
    proof.publicInput.target.assertEquals(this.sender.getAndRequireSignature());

    proof.verify();
  }

  @method async viaFriendContract(
    friendAddr: PublicKey,
    order: DelegationOrder,
    pair: WitnessPair,
  ) {
    order.target.assertEquals(this.sender.getAndRequireSignature());

    const friend = new DelegationZkApp(friendAddr);
    await friend.check(order, pair);
  }
}
