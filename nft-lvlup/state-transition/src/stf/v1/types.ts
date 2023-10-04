import type { CharacterType, InvalidInput } from '@game/utils';
import type { WalletAddress } from '@paima/sdk/utils';

export interface LvlUpInput {
  input: 'lvlUp';
  address: WalletAddress;
  tokenId: string;
}

export interface ScheduledDataInput {
  input: 'scheduledData';
}

export interface NftMintInput extends ScheduledDataInput {
  effect: 'nftMint';
  tokenId: string;
  // contract address
  address: WalletAddress;
  type: CharacterType;
}

export function isNftMint(input: ScheduledDataInput): input is NftMintInput {
  return (input as NftMintInput).effect === 'nftMint';
}

export type ParsedSubmittedInput = LvlUpInput | NftMintInput | InvalidInput;
