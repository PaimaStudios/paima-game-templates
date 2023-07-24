import type { FailedResult, SuccessfulResult, Wallet } from 'paima-sdk/paima-mw-core';

export type ActionResult = BaseResult | FailedResult;
export type Result<T> = SuccessfulResult<T> | FailedResult;

interface BaseResult {
  success: boolean;
  message?: string;
}

export interface UserState {
  experience: number;
  name: string;
  wallet: Wallet;
}
