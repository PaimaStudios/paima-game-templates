
CREATE TABLE lobby (
  lobby_id CHAR(12) PRIMARY KEY,
  current_round INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  creation_block_height INTEGER NOT NULL,
  lobby_creator TEXT NOT NULL,
  lobby_state TEXT CHECK (lobby_state IN ('open', 'active', 'finished', 'closed')),
  game_state TEXT,
  game_winner TEXT
);

CREATE TABLE lobby_player (
    lobby_id TEXT PRIMARY KEY NOT NULL references lobby(lobby_id),
    player_wallet TEXT NOT NULL
);

CREATE TABLE round (
    id SERIAL,
    lobby_id TEXT PRIMARY KEY NOT NULL references lobby(lobby_id),
    wallet TEXT NOT NULL,
    move TEXT NOT NULL,
    round INTEGER NOT NULL,
    block_height INTEGER NOT NULL
);

