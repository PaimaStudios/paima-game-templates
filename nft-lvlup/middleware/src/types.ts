import type { IGetUserCharactersResult } from '@game/db';
import type { FailedResult, SuccessfulResult } from '@paima/sdk/mw-core';

export type ActionResult = BaseResult | FailedResult;
export type Result<T> = SuccessfulResult<T> | FailedResult;

interface BaseResult {
  success: boolean;
  message?: string;
}

export interface LevelUpResponse {
  character: IGetUserCharactersResult;
}
