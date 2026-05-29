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

const createGlobalUserStateIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":61}]}],"statement":"INSERT INTO global_user_state (\n  wallet\n) VALUES (\n  :wallet!\n)\nON CONFLICT (wallet)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO global_user_state (
 *   wallet
 * ) VALUES (
 *   :wallet!
 * )
 * ON CONFLICT (wallet)
 * DO NOTHING
 * ```
 */
export const createGlobalUserState = new PreparedQuery<ICreateGlobalUserStateParams,ICreateGlobalUserStateResult>(createGlobalUserStateIR);


