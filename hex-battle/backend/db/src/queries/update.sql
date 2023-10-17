/* @name UpdateLobbyToActive */
UPDATE lobby
SET lobby_state = 'active', started_block_height = :started_block_height!
WHERE lobby_id = :lobby_id!
;

/* @name UpdateLobbyToClosed */
UPDATE lobby
SET lobby_state = 'closed'
WHERE lobby_id = :lobby_id!
;

/* @name UpdateLobbyWinner */
UPDATE lobby
SET game_winner = :game_winner!,
lobby_state = 'finished'
WHERE lobby_id = :lobby_id!
;

/* @name UpdateLobbyGameState */
UPDATE lobby
SET 
game_state = :game_state!,
current_round = :current_round!
WHERE lobby_id = :lobby_id!
;
