import { GAME_NAME } from '@game/utils';

import { delegateEvmToMina, Ecdsa, Secp256k1, DelegationOrderProof } from '@game/mina-contracts';
import { JsonProof, PublicKey, VerificationKey } from 'o1js';

const { DelegationOrder, DelegationOrderProgram, DelegationOrderProof } = delegateEvmToMina(
  `${GAME_NAME} login: `
);

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

export type Methods = typeof methods;

self.addEventListener('message', async event => {
  const { id, method, args } = event.data;
  const handler = methods[method as keyof Methods] as (...args: unknown[]) => unknown;
  const result = await handler(...args);
  postMessage({ id, result });
});
postMessage({ id: 0 }); // indicate ready
