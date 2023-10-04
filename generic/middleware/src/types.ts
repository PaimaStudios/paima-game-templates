import type { FailedResult, SuccessfulResult, Wallet } from '@paima/sdk/mw-core';

export type ActionResult = BaseResult | FailedResult;
export type Result<T> = SuccessfulResult<T> | FailedResult;

interface BaseResult {
  success: boolean;
  message?: string;
}

export interface UserState {
  experience: number;
  wallet: Wallet;
}
