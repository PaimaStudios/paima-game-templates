
CREATE TABLE lobby (
  lobby_id CHAR(12) PRIMARY KEY,
  game_state TEXT NOT NULL,
  current_round INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  started_block_height INTEGER,
  ended_block_height INTEGER,
  creation_block_height INTEGER NOT NULL,
  lobby_creator TEXT NOT NULL,
  lobby_state TEXT CHECK (lobby_state IN ('open', 'active', 'finished', 'closed')),
  game_winner TEXT,
  num_of_players INTEGER NOT NULL,
  map TEXT,
  units TEXT,
  buildings TEXT,
  gold INTEGER NOT NULL,
  init_tiles INTEGER NOT NULL,
  time_limit INTEGER NOT NULL,
  round_limit INTEGER NOT NULL
);

CREATE TABLE lobby_player (
    id SERIAL,
    lobby_id TEXT NOT NULL references lobby(lobby_id),
    player_wallet TEXT NOT NULL,
    PRIMARY KEY (lobby_id, player_wallet)
);

CREATE TABLE round (
    id SERIAL,
    lobby_id TEXT NOT NULL references lobby(lobby_id),
    wallet TEXT NOT NULL,
    move TEXT NOT NULL,
    round INTEGER NOT NULL,
    block_height INTEGER NOT NULL,
    PRIMARY KEY (lobby_id, id)

);
