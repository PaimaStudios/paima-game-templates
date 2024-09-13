/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'NewUser' parameters type */
export interface INewUserParams {
  wallet: string;
}

/** 'NewUser' return type */
export type INewUserResult = void;

/** 'NewUser' query type */
export interface INewUserQuery {
  params: INewUserParams;
  result: INewUserResult;
}

const newUserIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":41,"b":48}]}],"statement":"INSERT INTO user_state (wallet) \nVALUES (:wallet!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_state (wallet) 
 * VALUES (:wallet!)
 * ```
 */
export const newUser = new PreparedQuery<INewUserParams,INewUserResult>(newUserIR);


