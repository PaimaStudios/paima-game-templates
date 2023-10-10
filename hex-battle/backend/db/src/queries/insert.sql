/* @name createLobby */
INSERT INTO lobby(lobby_id, current_round, created_at, creation_block_height, lobby_creator, lobby_state, game_state, game_winner)
VALUES (:lobby_id!, 0, :created_at!, :creation_block_height!, :lobby_creator!, 'open', NULL, NULL);

