import { GameENV } from '@game/utils';
import type { ActionResult } from '../types';
import { builder } from '@paima/sdk/concise';
import { getDefaultActiveAddress, postConciselyEncodedData } from '@paima/sdk/mw-core';

async function renamePlayer(name: string): Promise<ActionResult> {
  const userWalletAddress = getDefaultActiveAddress();

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('r');
  conciseBuilder.addValue({ value: userWalletAddress, isStateIdentifier: true });
  conciseBuilder.addValue({ value: name });

  const result = await postConciselyEncodedData(conciseBuilder.build());
  return { success: result.success };
}

export const writeEndpoints = {
  renamePlayer,
};
