/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'CreateGlobalUserState' parameters type */
export interface ICreateGlobalUserStateParams {
  wallet: string;
}

/** 'CreateGlobalUserState' return type */
export type ICreateGlobalUserStateResult = void;

/** 'CreateGlobalUserState' query type */
export interface ICreateGlobalUserStateQuery {
  params: ICreateGlobalUserStateParams;
  result: ICreateGlobalUserStateResult;
}

const createGlobalUserStateIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":60}]}],"statement":"INSERT INTO global_user_state (\n  wallet\n) VALUES (\n :wallet!\n)\nON CONFLICT(wallet)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO global_user_state (
 *   wallet
 * ) VALUES (
 *  :wallet!
 * )
 * ON CONFLICT(wallet)
 * DO NOTHING
 * ```
 */
export const createGlobalUserState = new PreparedQuery<ICreateGlobalUserStateParams,ICreateGlobalUserStateResult>(createGlobalUserStateIR);


/** 'CreateUserTokenState' parameters type */
export interface ICreateUserTokenStateParams {
  amount: number;
  isDiamond: boolean;
  wallet: string;
}

/** 'CreateUserTokenState' return type */
export type ICreateUserTokenStateResult = void;

/** 'CreateUserTokenState' query type */
export interface ICreateUserTokenStateQuery {
  params: ICreateUserTokenStateParams;
  result: ICreateUserTokenStateResult;
}

const createUserTokenStateIR: any = {"usedParamSet":{"wallet":true,"amount":true,"isDiamond":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":91,"b":98},{"a":168,"b":174}]},{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":180,"b":187}]},{"name":"isDiamond","required":true,"transform":{"type":"scalar"},"locs":[{"a":192,"b":202}]}],"statement":"INSERT INTO user_token_state (\n  wallet,\n  userTokenId,\n  amount,\n  isDiamond\n) VALUES (\n  :wallet!,\n  (SELECT currentUserTokenId FROM global_user_state WHERE wallet = :wallet),\n  :amount!,\n  :isDiamond!\n)\nON CONFLICT (wallet, userTokenId)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_token_state (
 *   wallet,
 *   userTokenId,
 *   amount,
 *   isDiamond
 * ) VALUES (
 *   :wallet!,
 *   (SELECT currentUserTokenId FROM global_user_state WHERE wallet = :wallet),
 *   :amount!,
 *   :isDiamond!
 * )
 * ON CONFLICT (wallet, userTokenId)
 * DO NOTHING
 * ```
 */
export const createUserTokenState = new PreparedQuery<ICreateUserTokenStateParams,ICreateUserTokenStateResult>(createUserTokenStateIR);


