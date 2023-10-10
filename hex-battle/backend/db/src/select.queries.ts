/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetOpenLobbies' parameters type */
export type IGetOpenLobbiesParams = void;

/** 'GetOpenLobbies' return type */
export interface IGetOpenLobbiesResult {
  created_at: Date;
  creation_block_height: number;
  current_round: number;
  game_state: string | null;
  game_winner: string | null;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: string | null;
}

/** 'GetOpenLobbies' query type */
export interface IGetOpenLobbiesQuery {
  params: IGetOpenLobbiesParams;
  result: IGetOpenLobbiesResult;
}

const getOpenLobbiesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM lobby \nwhere lobby_state = 'open'\nand created_at > now() - interval '1 day' \norder by created_at desc"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM lobby 
 * where lobby_state = 'open'
 * and created_at > now() - interval '1 day' 
 * order by created_at desc
 * ```
 */
export const getOpenLobbies = new PreparedQuery<IGetOpenLobbiesParams,IGetOpenLobbiesResult>(getOpenLobbiesIR);


