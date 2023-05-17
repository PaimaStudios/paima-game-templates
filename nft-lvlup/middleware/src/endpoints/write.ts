import type { ActionResult } from '../types';
import { builder } from 'paima-sdk/paima-concise';
import { getActiveAddress, postConciselyEncodedData } from 'paima-sdk/paima-mw-core';

async function gainExperience(count: number): Promise<ActionResult> {
  const userWalletAddress = getActiveAddress();

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('xp');
  conciseBuilder.addValue({ value: userWalletAddress, isStateIdentifier: true });
  conciseBuilder.addValue({ value: count.toString() });

  const result = await postConciselyEncodedData(conciseBuilder.build());
  return { success: result.success };
}

export const writeEndpoints = {
  gainExperience,
};
