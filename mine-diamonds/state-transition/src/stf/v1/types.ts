export type ParsedSubmittedInput =
  | InvalidInput
  | SubmitMineAttemptInput
  | OrderCreatedInput
  | AssetMintedInput
  | AssetTransferredInput
  | OrderFilledInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface SubmitMineAttemptInput {
  input: 'submitMineAttempt';
}

export interface OrderCreatedInput {
  input: 'orderCreated';
  payload: {
    seller: string;
    orderId: string;
    assetId: string;
    assetAmount: string;
    pricePerAsset: string;
  };
}

export interface OrderFilledInput {
  input: 'orderFilled';
  payload: {
    seller: string;
    orderId: string;
    buyer: string;
    assetAmount: string;
    pricePerAsset: string;
  };
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

export interface AssetTransferredInput {
  input: 'assetTransferred';
  payload: {
    operator: string;
    from: string;
    to: string;
    id: string;
    value: string;
  };
}
