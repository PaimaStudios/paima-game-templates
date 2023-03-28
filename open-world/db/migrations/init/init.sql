-- //TODO: remove possibly ?
CREATE TABLE block_heights ( 
  block_height INTEGER PRIMARY KEY,
  seed TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

-- //TODO: remove start
CREATE TABLE scheduled_data (
  id SERIAL PRIMARY KEY,
  block_height INTEGER NOT NULL,
  input_data TEXT NOT NULL
);

CREATE TABLE nonces (
  nonce TEXT PRIMARY KEY,
  block_height INTEGER NOT NULL
);

-- //TODO: remove end

-- world is Y by X matrix
--        0     1     2    X
--     |-----|-----|-----|
--  0  | 0,0 | 1,0 | 2,0 |
--  1  | 0,1 | 1,1 | 2,1 |
--  2  | 0,2 | 1,2 | 2,2 |
-- 
--  Y
-- 
CREATE TABLE global_world_state (
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  can_visit BOOLEAN NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (x, y)
);

CREATE TABLE global_user_state (
  wallet TEXT NOT NULL PRIMARY KEY,
  -- previous_x INTEGER NOT NULL for monster game,
  -- previous_y INTEGER NOT NULL for monster game,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  -- move_block_height INTEGER NOT NULL references block_heights(block_height),
  FOREIGN KEY (x, y) REFERENCES global_world_state (x, y)
);
