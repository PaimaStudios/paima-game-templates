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
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  FOREIGN KEY (x, y) REFERENCES global_world_state (x, y)
);
