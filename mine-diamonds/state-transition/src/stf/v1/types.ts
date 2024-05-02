export type ParsedSubmittedInput =
  | InvalidInput
  | SubmitMineAttemptInput
  | OrderCreatedInput
  | AssetMintedInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface SubmitMineAttemptInput {
  input: 'submitMineAttempt';
}

export interface OrderCreatedInput {
  input: 'orderCreated';
}

export interface AssetMintedInput {
  input: 'assetMinted';
  payload: {
    tokenId: number;
    minter: string;
    userTokenId: number;
    value: number;
  };
}
