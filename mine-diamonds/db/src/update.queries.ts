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


