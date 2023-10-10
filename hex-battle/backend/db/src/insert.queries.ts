/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

/** 'CreateLobby' parameters type */
export interface ICreateLobbyParams {
  created_at: DateOrString;
  creation_block_height: number;
  lobby_creator: string;
  lobby_id: string;
}

/** 'CreateLobby' return type */
export type ICreateLobbyResult = void;

/** 'CreateLobby' query type */
export interface ICreateLobbyQuery {
  params: ICreateLobbyParams;
  result: ICreateLobbyResult;
}

const createLobbyIR: any = {"usedParamSet":{"lobby_id":true,"created_at":true,"creation_block_height":true,"lobby_creator":true},"params":[{"name":"lobby_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":148}]},{"name":"created_at","required":true,"transform":{"type":"scalar"},"locs":[{"a":154,"b":165}]},{"name":"creation_block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":168,"b":190}]},{"name":"lobby_creator","required":true,"transform":{"type":"scalar"},"locs":[{"a":193,"b":207}]}],"statement":"INSERT INTO lobby(lobby_id, current_round, created_at, creation_block_height, lobby_creator, lobby_state, game_state, game_winner)\nVALUES (:lobby_id!, 0, :created_at!, :creation_block_height!, :lobby_creator!, 'open', NULL, NULL)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO lobby(lobby_id, current_round, created_at, creation_block_height, lobby_creator, lobby_state, game_state, game_winner)
 * VALUES (:lobby_id!, 0, :created_at!, :creation_block_height!, :lobby_creator!, 'open', NULL, NULL)
 * ```
 */
export const createLobby = new PreparedQuery<ICreateLobbyParams,ICreateLobbyResult>(createLobbyIR);


