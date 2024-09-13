/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetUser' parameters type */
export interface IGetUserParams {
  wallet: string;
}

/** 'GetUser' return type */
export interface IGetUserResult {
  wallet: string;
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams;
  result: IGetUserResult;
}

const getUserIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":40,"b":47}]}],"statement":"SELECT * FROM user_state WHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM user_state WHERE wallet = :wallet!
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams,IGetUserResult>(getUserIR);


/** 'GetUserItems' parameters type */
export interface IGetUserItemsParams {
  wallet: string;
}

/** 'GetUserItems' return type */
export interface IGetUserItemsResult {
  amount: number;
  item_id: string;
  wallet: string;
}

/** 'GetUserItems' query type */
export interface IGetUserItemsQuery {
  params: IGetUserItemsParams;
  result: IGetUserItemsResult;
}

const getUserItemsIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":46}]}],"statement":"SELECT * FROM user_item WHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM user_item WHERE wallet = :wallet!
 * ```
 */
export const getUserItems = new PreparedQuery<IGetUserItemsParams,IGetUserItemsResult>(getUserItemsIR);


