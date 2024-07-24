
import { GAME_NAME, gameBackendVersion } from '@game/utils';

import { delegateEvmToMina, Ecdsa, Secp256k1 } from '@game/mina-contracts';

const { DelegationOrder, DelegationOrderProgram, DelegationOrderProof } = delegateEvmToMina(
  `${GAME_NAME} login: `
);

console.log('Hello from worker');
