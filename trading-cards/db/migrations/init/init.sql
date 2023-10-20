-- Generic paima engine table, that can't be modified
CREATE TABLE block_heights ( 
  block_height INTEGER PRIMARY KEY,
  seed TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

-- Extend the schema to fit your needs
CREATE TYPE lobby_status AS ENUM ('open', 'active', 'finished', 'closed');
CREATE TYPE concise_result AS ENUM ('w', 't', 'l');
CREATE TABLE lobbies (
  lobby_id TEXT PRIMARY KEY,
  max_players INTEGER NOT NULL,
  num_of_rounds INTEGER NOT NULL,
  turn_length INTEGER NOT NULL,
  current_match INTEGER,
  current_round INTEGER,
  current_turn INTEGER,
  current_proper_round INTEGER,
  current_tx_event_move TEXT,
  created_at TIMESTAMP NOT NULL,
  creation_block_height INTEGER NOT NULL,
  hidden BOOLEAN NOT NULL DEFAULT false,
  practice BOOLEAN NOT NULL DEFAULT false,
  lobby_creator INTEGER NOT NULL,
  lobby_state lobby_status NOT NULL
);

CREATE TABLE lobby_match(
  id SERIAL PRIMARY KEY,
  lobby_id TEXT NOT NULL references lobbies(lobby_id),
  match_within_lobby INTEGER NOT NULL,
  starting_block_height INTEGER NOT NULL references block_heights(block_height)
);

CREATE TABLE match_round(
  id SERIAL PRIMARY KEY,
  lobby_id TEXT NOT NULL references lobbies(lobby_id),
  match_within_lobby INTEGER NOT NULL,
  round_within_match INTEGER NOT NULL,
  starting_block_height INTEGER NOT NULL references block_heights(block_height),
  execution_block_Height INTEGER references block_heights(block_height)
);

CREATE TABLE round_move (
  id SERIAL PRIMARY KEY,
  lobby_id TEXT NOT NULL references lobbies(lobby_id),
  match_within_lobby INTEGER NOT NULL,
  round_within_match INTEGER NOT NULL,
  move_within_round INTEGER NOT NULL,
  nft_id INTEGER NOT NULL,
  serialized_move TEXT NOT NULL
);

CREATE TABLE global_user_state (
  nft_id INTEGER NOT NULL PRIMARY KEY,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  ties INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE lobby_player (
  id SERIAL PRIMARY KEY,
  lobby_id TEXT NOT NULL references lobbies(lobby_id),
  -- TODO: should ref global_user_state, but bot does not have an entry
  nft_id INTEGER NOT NULL,
  starting_commitments BYTEA NOT NULL,
  hit_points INTEGER NOT NULL,
  current_deck INTEGER[] NOT NULL,
  current_hand TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  current_board TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  current_draw INTEGER NOT NULL DEFAULT 0,
  current_result concise_result DEFAULT null,
  -- local deck in case this is a bot player
  bot_local_deck TEXT[] DEFAULT NULL,
  turn INTEGER
);

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  -- not owned if currently assigned to a trade nft
  owner_nft_id INTEGER references global_user_state(nft_id),
  registry_id INTEGER NOT NULL
);

-- table used to track *bought* packs, the buyer might not own the cards anymore
CREATE TABLE card_packs (
  id SERIAL PRIMARY KEY,
  buyer_nft_id INTEGER NOT NULL references global_user_state(nft_id),
  card_registry_ids INTEGER[] NOT NULL
);

CREATE TABLE card_trade_nft (
  nft_id INTEGER NOT NULL PRIMARY KEY,
  cards INTEGER[]
);