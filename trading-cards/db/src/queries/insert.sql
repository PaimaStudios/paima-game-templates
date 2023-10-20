/* 
  @name createLobby 
*/
INSERT INTO lobbies(
  lobby_id,
  max_players,
  num_of_rounds,
  turn_length,
  creation_block_height,
  created_at,
  hidden,
  practice,
  lobby_creator,
  lobby_state
)
VALUES(
  :lobby_id!,
  :max_players!,
  :num_of_rounds!,
  :turn_length!,
  :creation_block_height!,
  :created_at!,
  :hidden!,
  :practice!,
  :lobby_creator!,
  :lobby_state!
);

/* @name joinPlayerToLobby */
INSERT INTO lobby_player(
  lobby_id,
  nft_id,
  hit_points,
  starting_commitments,
  current_deck,
  bot_local_deck
)
VALUES(
  :lobby_id!,
  :nft_id!,
  :hit_points!,
  :starting_commitments!,
  :current_deck!,
  :bot_local_deck
);

/* @name newMatch */
INSERT INTO lobby_match(
  lobby_id,
  match_within_lobby,
  starting_block_height
)
VALUES (
  :lobby_id!,
  :match_within_lobby!,
  :starting_block_height!
)
RETURNING *;

/* 
  @name newRound
*/
INSERT INTO match_round(
  lobby_id,
  match_within_lobby,
  round_within_match,
  starting_block_height,
  execution_block_height
)
VALUES (
  :lobby_id!,
  :match_within_lobby!,
  :round_within_match!,
  :starting_block_height!,
  :execution_block_height
)
RETURNING *;

/* 
  @name newMove
*/
INSERT INTO round_move(
  lobby_id,
  match_within_lobby,
  round_within_match,
  move_within_round,
  nft_id,
  serialized_move
)
VALUES (
  :lobby_id!,
  :match_within_lobby!,
  :round_within_match!,
  :move_within_round!,
  :nft_id!,
  :serialized_move!
);

/* @name newStats
  @param stats -> (nft_id!, wins!, losses!, ties!)
*/
INSERT INTO global_user_state
VALUES :stats
ON CONFLICT (nft_id)
DO NOTHING;

/* 
  @name updateStats
  @param stats -> (nft_id!, wins!, losses!, ties!)
*/
INSERT INTO global_user_state
VALUES :stats
ON CONFLICT (nft_id)
DO UPDATE SET
wins = EXCLUDED.wins,
losses = EXCLUDED.losses,
ties = EXCLUDED.ties;

/* @name newCardPack */
INSERT INTO card_packs(
  buyer_nft_id,
  card_registry_ids
)
VALUES (
  :buyer_nft_id!,
  :card_registry_ids!
);

/* @name newCard */
INSERT INTO cards(
  owner_nft_id,
  registry_id
)
VALUES (
  :owner_nft_id!,
  :registry_id!
);

/* @name newTradeNft */
INSERT INTO card_trade_nft(
  nft_id
)
VALUES (
  :nft_id!
);