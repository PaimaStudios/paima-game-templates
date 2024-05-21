-- Generic paima engine table, that can't be modified
CREATE TABLE block_heights ( 
  block_height INTEGER PRIMARY KEY,
  seed TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

-- Extend the schema to fit your needs

CREATE TABLE users (
  wallet TEXT NOT NULL PRIMARY KEY,
  experience INTEGER NOT NULL DEFAULT 0
);
