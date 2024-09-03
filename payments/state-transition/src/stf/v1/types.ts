export type ParsedSubmittedInput = InvalidInput | PurchaseItemInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface PurchaseItemInput {
  input: 'purchase_item';
  wallet: string;
  item_id: number;
  amount: number;
}