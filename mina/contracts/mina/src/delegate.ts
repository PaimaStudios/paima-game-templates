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


class Bytes32 extends Bytes(32) {}


const prefix = '\x19Ethereum Signed Message:\n';


export const DelegateProof = ZkProgram({
  name: 'DelegateProof',

  methods: {
    meme: {
      privateInputs: [Provable.Array(UInt8, 40), Ecdsa.provable, Secp256k1.provable],

      async method(
        message: UInt8[],
        /** Public input: the puzzle to be solved. */
        signature: Ecdsa,
        /** Private input: the solution. */
        publicKey: ForeignCurve,
      ) {
        Provable.log(message);
        Provable.log(signature);
        Provable.log(publicKey);

        /*
        const BigBytesType = createBytes(prefix.length + String(message.length).length + message.length);
        BigBytesType.fromString();

        const msg = Bytes.from(message);

        Bytes.

        '\x19Ethereum Signed Message:\n' + message.length

        message.length
        */

        //const digest = Keccak.ethereum(message);

        Provable.asProver(() => console.time('verifyV2'));
        signature.verifyV2(Bytes.from(message), publicKey).assertTrue();
        Provable.asProver(() => console.timeEnd('verifyV2'));
      }
    }
  }
});

