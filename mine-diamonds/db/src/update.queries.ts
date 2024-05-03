/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'UpdateUserStateCurrentTokenId' parameters type */
export interface IUpdateUserStateCurrentTokenIdParams {
  wallet: string;
}

/** 'UpdateUserStateCurrentTokenId' return type */
export type IUpdateUserStateCurrentTokenIdResult = void;

/** 'UpdateUserStateCurrentTokenId' query type */
export interface IUpdateUserStateCurrentTokenIdQuery {
  params: IUpdateUserStateCurrentTokenIdParams;
  result: IUpdateUserStateCurrentTokenIdResult;
}

const updateUserStateCurrentTokenIdIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":95}]}],"statement":"UPDATE global_user_state\nSET currentUserTokenId = currentUserTokenId + 1\nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE global_user_state
 * SET currentUserTokenId = currentUserTokenId + 1
 * WHERE wallet = :wallet!
 * ```
 */
export const updateUserStateCurrentTokenId = new PreparedQuery<IUpdateUserStateCurrentTokenIdParams,IUpdateUserStateCurrentTokenIdResult>(updateUserStateCurrentTokenIdIR);


/** 'UpdateDexOrder' parameters type */
export interface IUpdateDexOrderParams {
  amount: number;
}

/** 'UpdateDexOrder' return type */
export type IUpdateDexOrderResult = void;

/** 'UpdateDexOrder' query type */
export interface IUpdateDexOrderQuery {
  params: IUpdateDexOrderParams;
  result: IUpdateDexOrderResult;
}

const updateDexOrderIR: any = {"usedParamSet":{"amount":true},"params":[{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":37}]}],"statement":"UPDATE dex_order\nSET amount = :amount!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE dex_order
 * SET amount = :amount!
 * ```
 */
export const updateDexOrder = new PreparedQuery<IUpdateDexOrderParams,IUpdateDexOrderResult>(updateDexOrderIR);


/** 'UpdateAssetOwnership' parameters type */
export interface IUpdateAssetOwnershipParams {
  assetTokenId: number;
  delta: number;
  wallet: string;
}

/** 'UpdateAssetOwnership' return type */
export type IUpdateAssetOwnershipResult = void;

/** 'UpdateAssetOwnership' query type */
export interface IUpdateAssetOwnershipQuery {
  params: IUpdateAssetOwnershipParams;
  result: IUpdateAssetOwnershipResult;
}

const updateAssetOwnershipIR: any = {"usedParamSet":{"delta":true,"wallet":true,"assetTokenId":true},"params":[{"name":"delta","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":57}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":74,"b":81}]},{"name":"assetTokenId","required":true,"transform":{"type":"scalar"},"locs":[{"a":102,"b":115}]}],"statement":"UPDATE asset_token_ownership\nSET amount = amount + :delta!\nWHERE wallet = :wallet! AND assetTokenId = :assetTokenId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE asset_token_ownership
 * SET amount = amount + :delta!
 * WHERE wallet = :wallet! AND assetTokenId = :assetTokenId!
 * ```
 */
export const updateAssetOwnership = new PreparedQuery<IUpdateAssetOwnershipParams,IUpdateAssetOwnershipResult>(updateAssetOwnershipIR);


