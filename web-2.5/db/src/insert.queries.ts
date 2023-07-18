/** Types generated for queries found in "src/insert.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'UpsertUser' parameters type */
export interface IUpsertUserParams {
  experience: number;
  name: string | null | void;
  wallet: string;
}

/** 'UpsertUser' return type */
export type IUpsertUserResult = void;

/** 'UpsertUser' query type */
export interface IUpsertUserQuery {
  params: IUpsertUserParams;
  result: IUpsertUserResult;
}

const upsertUserIR: any = {"usedParamSet":{"wallet":true,"name":true,"experience":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":52,"b":59}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":62,"b":66}]},{"name":"experience","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":80}]}],"statement":"INSERT INTO users(wallet, name, experience)\nVALUES (:wallet!, :name, :experience!)\nON CONFLICT (wallet)\nDO UPDATE SET\nexperience = EXCLUDED.experience,\nname = EXCLUDED.name"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users(wallet, name, experience)
 * VALUES (:wallet!, :name, :experience!)
 * ON CONFLICT (wallet)
 * DO UPDATE SET
 * experience = EXCLUDED.experience,
 * name = EXCLUDED.name
 * ```
 */
export const upsertUser = new PreparedQuery<IUpsertUserParams,IUpsertUserResult>(upsertUserIR);


