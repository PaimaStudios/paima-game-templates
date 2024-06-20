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
  Reducer,
  PublicKey,
  ZkProgram,
  MerkleMap,
  EcdsaSignature,
  Keccak,
  createEcdsa,
  createForeignCurve,
  Crypto,
  ForeignCurve,
  Bytes,
  UInt64,
  UInt8
} from 'o1js';
import { createBytes } from 'o1js/dist/node/lib/provable/bytes';
import { keccak256 } from 'viem';


export class Secp256k1 extends createForeignCurve(Crypto.CurveParams.Secp256k1) {}
export class Ecdsa extends createEcdsa(Secp256k1) {}


const ethereumPrefix = '\x19Ethereum Signed Message:\n';
const delegationPrefix = 'MinaDelegate|';
const innerLength = delegationPrefix.length + 33;
const outerLength = ethereumPrefix.length + String(innerLength).length + innerLength;

console.log('outerLength =', outerLength);

class BytesDelegation extends Bytes(outerLength) {}


export class DelegationOrder extends Struct({
  /** Mina public key that the delegation order is issued for. */
  target: PublicKey,
  /** Ethereum public key that signed the delegation order. */
  signer: Secp256k1.provable,
}) {

}


function utf8(s: string) {
  return [...new TextEncoder().encode(s)].map(b => new UInt8(b));
}


function boolToU8(bool: Bool): UInt8 {
  return UInt8.from(bool.toField());
}


export function encodeKey(k: PublicKey): UInt8[] {
  const bytes = [boolToU8(k.isOdd)];
  const bits = k.x.toBits();
  console.log('encodeKey bits.length=', bits.length);
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
        Provable.log('order:', order);
        Provable.log('signature:', signature);

        const fullMessage = Bytes.from([
          ...utf8(ethereumPrefix),
          ...utf8(String(innerLength)),
          ...utf8(delegationPrefix),
          // TODO: does this break the circuit?
          ...encodeKey(order.target),
        ]);

        Provable.log('full message:', fullMessage);

        Provable.asProver(() => console.time('verifyV2'));
        signature.verifyV2(Bytes.from(fullMessage), order.signer).assertTrue();
        Provable.asProver(() => console.timeEnd('verifyV2'));
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
