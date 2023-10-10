/* @name UpdateLobbyState */
UPDATE lobby 
SET lobby_state = :lobby_state!
WHERE lobby_id = :lobby_id!
;
