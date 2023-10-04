import type { SQLUpdate } from '@paima/sdk/db';
import type { Pool } from 'pg';
import type { LvlUpInput, NftMintInput, ScheduledDataInput } from './types';
import { isNftMint } from './types';
import { persistCreate, persistLvlUp } from './persist';
import { isNftOwner } from '@paima/sdk/utils-backend';
import type { WalletAddress } from '@paima/sdk/utils';
import { CHARACTERS_CDE } from '@game/utils';

export const lvlUp = async (
  user: WalletAddress,
  input: LvlUpInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const nftId = BigInt(input.tokenId);
  if (!isNftOwner(dbConn, CHARACTERS_CDE, nftId, user)) {
    console.log('NFT to lvlup not owned by user');
    return [];
  }
  const lvlUpQuery = persistLvlUp(input.address, input.tokenId);
  return [lvlUpQuery];
};

export const nftMint = async (input: NftMintInput): Promise<SQLUpdate[]> => {
  const characterCreateQuery = persistCreate(input.address, input.tokenId, input.type);
  return [characterCreateQuery];
};

export const scheduledData = async (input: ScheduledDataInput): Promise<SQLUpdate[]> => {
  if (isNftMint(input)) {
    return nftMint(input);
  }
  return [];
};
