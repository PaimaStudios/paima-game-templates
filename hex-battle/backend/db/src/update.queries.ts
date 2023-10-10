/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'UpdateLobbyState' parameters type */
export interface IUpdateLobbyStateParams {
  lobby_id: string;
  lobby_state: string;
}

/** 'UpdateLobbyState' return type */
export type IUpdateLobbyStateResult = void;

/** 'UpdateLobbyState' query type */
export interface IUpdateLobbyStateQuery {
  params: IUpdateLobbyStateParams;
  result: IUpdateLobbyStateResult;
}

const updateLobbyStateIR: any = {"usedParamSet":{"lobby_state":true,"lobby_id":true},"params":[{"name":"lobby_state","required":true,"transform":{"type":"scalar"},"locs":[{"a":32,"b":44}]},{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":63,"b":72}]}],"statement":"UPDATE lobby \nSET lobby_state = :lobby_state!\nWHERE lobby_id = :lobby_id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE lobby 
 * SET lobby_state = :lobby_state!
 * WHERE lobby_id = :lobby_id!
 * ```
 */
export const updateLobbyState = new PreparedQuery<IUpdateLobbyStateParams,IUpdateLobbyStateResult>(updateLobbyStateIR);


