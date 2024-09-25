/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetMidnightEvmEvents' parameters type */
export interface IGetMidnightEvmEventsParams {
  from_block_height?: number | null | void;
}

/** 'GetMidnightEvmEvents' return type */
export interface IGetMidnightEvmEventsResult {
  block_height: number;
  id: number;
  raw: string | null;
  source: string;
  unix_time: number;
}

/** 'GetMidnightEvmEvents' query type */
export interface IGetMidnightEvmEventsQuery {
  params: IGetMidnightEvmEventsParams;
  result: IGetMidnightEvmEventsResult;
}

const getMidnightEvmEventsIR: any = {"usedParamSet":{"from_block_height":true},"params":[{"name":"from_block_height","required":false,"transform":{"type":"scalar"},"locs":[{"a":56,"b":73}]}],"statement":"SELECT * FROM midnight_evm_events\nWHERE block_height >= :from_block_height"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM midnight_evm_events
 * WHERE block_height >= :from_block_height
 * ```
 */
export const getMidnightEvmEvents = new PreparedQuery<IGetMidnightEvmEventsParams,IGetMidnightEvmEventsResult>(getMidnightEvmEventsIR);


