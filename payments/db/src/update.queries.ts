/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'UpsertItem' parameters type */
export interface IUpsertItemParams {
  amount: number;
  item_id: string;
  wallet: string;
}

/** 'UpsertItem' return type */
export type IUpsertItemResult = void;

/** 'UpsertItem' query type */
export interface IUpsertItemQuery {
  params: IUpsertItemParams;
  result: IUpsertItemResult;
}

const upsertItemIR: any = {"usedParamSet":{"wallet":true,"item_id":true,"amount":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":67,"b":74}]},{"name":"item_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":85}]},{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":95}]}],"statement":"INSERT INTO user_item \n    (wallet, item_id, amount) \nVALUES \n    (:wallet!, :item_id!, :amount!)\nON CONFLICT \n    (wallet, item_id) \nDO UPDATE SET \n    amount = user_item.amount + EXCLUDED.amount"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_item 
 *     (wallet, item_id, amount) 
 * VALUES 
 *     (:wallet!, :item_id!, :amount!)
 * ON CONFLICT 
 *     (wallet, item_id) 
 * DO UPDATE SET 
 *     amount = user_item.amount + EXCLUDED.amount
 * ```
 */
export const upsertItem = new PreparedQuery<IUpsertItemParams,IUpsertItemResult>(upsertItemIR);


