/* @name getMyActiveLobbies */
SELECT 
    lobby_player.lobby_id, 
    lobby_state, 
    num_of_players, 
    current_round, 
    lobby_creator, 
    lobby_player.player_wallet 
    units,
    buildings,
    gold,
    init_tiles,
    time_limit,
    round_limit,
    started_block_height
FROM lobby_player
INNER JOIN lobby as LL ON LL.lobby_id = lobby_player.lobby_id 
WHERE lobby_player.player_wallet = :player_wallet!
AND (LL.lobby_state = 'active' OR LL.lobby_state = 'open')
ORDER BY created_at DESC
;

/* @name getOpenLobbies */
SELECT 
    lobby_creator,
    lobby_id, 
    lobby_state, 
    num_of_players,  
    units,
    buildings,
    gold,
    init_tiles,
    time_limit,
    round_limit,
    creation_block_height
FROM lobby 
where lobby_state = 'open'
AND created_at > now() - interval '1 day' 
ORDER BY created_at DESC
;

/* @name getLatestCreatedLobby */
SELECT lobby_id, lobby_state, num_of_players, current_round, lobby_creator FROM lobby
WHERE lobby_state = 'open'
AND lobby_creator = :lobby_creator!
AND created_at > now() - interval '1 day'
ORDER BY created_at DESC
LIMIT 1
;

/* @name getLobbyMap */
SELECT lobby_id, map 
FROM lobby 
WHERE lobby_id = :lobby_id!
;

/* @name getLobbyGameState */
SELECT lobby_id, game_state
FROM lobby
WHERE lobby_id = :lobby_id!
;

/* @name getLobbyLean */
SELECT lobby_id, current_round, created_at, lobby_creator, lobby_state, game_winner, num_of_players, units, buildings, gold, init_tiles, time_limit, round_limit, started_block_height
FROM lobby 
WHERE lobby_id = :lobby_id!
;

/* @name myJoinedGames */
SELECT * FROM lobby_player 
WHERE lobby_id = :lobby_id!
AND player_wallet = :player_wallet!
;

/* @name getLobbyPlayers */
SELECT * FROM lobby_player 
WHERE lobby_id = :lobby_id!
ORDER BY id ASC
;

/* @name getLobbyRounds */
SELECT * FROM round 
WHERE lobby_id = :lobby_id!
;

/* @name getMovesForRound */
SELECT * FROM round 
WHERE lobby_id = :lobby_id!
AND round = :round!
LIMIT 1
;