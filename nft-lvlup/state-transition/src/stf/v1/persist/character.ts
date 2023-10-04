import type { ICreateCharacterParams, ILvlUpCharacterParams } from '@game/db';
import { createCharacter } from '@game/db';
import { lvlUpCharacter } from '@game/db';
import type { CharacterType } from '@game/utils';
import type { SQLUpdate } from '@paima/sdk/db';
import type { WalletAddress } from '@paima/sdk/utils';

// this file deals with receiving blockchain data input and outputting SQL updates (imported from pgTyped output of our SQL files)
// PGTyped SQL updates are a tuple of the function calling the database and the params sent to it.

export function persistLvlUp(address: WalletAddress, nftId: string): SQLUpdate {
  const params: ILvlUpCharacterParams = {
    address,
    nft_id: nftId,
  };
  return [lvlUpCharacter, params];
}

export function persistCreate(
  address: WalletAddress,
  nftId: string,
  type: CharacterType
): SQLUpdate {
  const params: ICreateCharacterParams = {
    type,
    address,
    nft_id: nftId,
  };
  return [createCharacter, params];
}
