import { JsonProof, PublicKey } from 'o1js';
import { delegateEvmToMina, Ecdsa, Secp256k1 } from '@paima/mina-delegation';

export type Methods = typeof methods;
export type InitParams = {
  prefix: string;
};

const initParams = Object.fromEntries(new URLSearchParams(new URL(import.meta.url).hash.substring(1))) as InitParams;
const { DelegationOrder, DelegationOrderProgram } = delegateEvmToMina(initParams.prefix);

const methods = {
  async compile(): Promise<string> {
    console.time('DelegationOrderProgram.compile');
    const { verificationKey } = await DelegationOrderProgram.compile();
    console.timeEnd('DelegationOrderProgram.compile');
    // NB: do not use VerificationKey.toJSON as it just returns the "data" field
    // which is NOT the format that fromJSON expects.
    return JSON.stringify(verificationKey);
  },

  async sign({
    target,
    signer,
    signature,
  }: {
    target: string;
    signer: string;
    signature: string;
  }): Promise<JsonProof> {
    console.time('DelegationOrderProgram.sign');
    const proof = await DelegationOrderProgram.sign(
      new DelegationOrder({
        target: PublicKey.fromBase58(target),
        signer: Secp256k1.fromHex(signer),
      }),
      Ecdsa.fromHex(signature)
    );
    console.timeEnd('DelegationOrderProgram.sign');
    return proof.toJSON();
  },
} as const;

self.addEventListener('message', async event => {
  const { id, method, args } = event.data;
  const handler = methods[method as keyof Methods] as (...args: unknown[]) => unknown;
  const result = await handler(...args);
  postMessage({ id, result });
});
postMessage({ id: 0 }); // indicate ready
