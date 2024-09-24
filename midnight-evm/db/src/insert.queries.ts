/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertMidnightEvmEvent' parameters type */
export interface IInsertMidnightEvmEventParams {
  block_height: number;
  raw: string;
  source: string;
  unix_time: number;
}

/** 'InsertMidnightEvmEvent' return type */
export type IInsertMidnightEvmEventResult = void;

/** 'InsertMidnightEvmEvent' query type */
export interface IInsertMidnightEvmEventQuery {
  params: IInsertMidnightEvmEventParams;
  result: IInsertMidnightEvmEventResult;
}

const insertMidnightEvmEventIR: any = {"usedParamSet":{"source":true,"raw":true,"unix_time":true,"block_height":true},"params":[{"name":"source","required":true,"transform":{"type":"scalar"},"locs":[{"a":91,"b":98}]},{"name":"raw","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":107}]},{"name":"unix_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":122}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":140}]}],"statement":"INSERT INTO midnight_evm_events(\n  source,\n  raw,\n  unix_time,\n  block_height\n) VALUES (\n  :source!,\n  :raw!,\n  :unix_time!,\n  :block_height!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO midnight_evm_events(
 *   source,
 *   raw,
 *   unix_time,
 *   block_height
 * ) VALUES (
 *   :source!,
 *   :raw!,
 *   :unix_time!,
 *   :block_height!
 * )
 * ```
 */
export const insertMidnightEvmEvent = new PreparedQuery<IInsertMidnightEvmEventParams,IInsertMidnightEvmEventResult>(insertMidnightEvmEventIR);


