import type { LevelUpResponse } from '../types';
import { builder } from '@paima/sdk/concise';
import type { Result } from '@paima/sdk/mw-core';
import { awaitBlock, postConciseData } from '@paima/sdk/mw-core';
import { MiddlewareErrorCode, buildEndpointErrorFxn } from '../errors';
import type { WalletAddress } from '@paima/sdk/utils';
import { getOwnedCharacters } from './queries';
import { getUserWallet } from '../helpers/utility-functions';
import { ENV } from '@paima/sdk/utils';

async function levelUp(
  contractAddress: WalletAddress,
  nftId: string
): Promise<Result<LevelUpResponse>> {
  const errorFxn = buildEndpointErrorFxn('levelUp');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('l');
  conciseBuilder.addValue({ value: contractAddress });
  conciseBuilder.addValue({ value: nftId, isStateIdentifier: true });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock + 1);
    const ownedCharacters = await getOwnedCharacters(userWalletAddress);
    const updatedCharacter =
      ownedCharacters.success &&
      ownedCharacters.result.characters.find(character => character.nft_id === nftId);
    if (!updatedCharacter) {
      return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_NFT_OWNERSHIP);
    }
    return {
      success: true,
      result: { character: updatedCharacter },
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_NFT_OWNERSHIP);
  }
}

export const writeEndpoints = {
  levelUp,
};
