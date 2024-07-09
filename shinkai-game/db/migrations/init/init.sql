
CREATE TABLE global_world_state (
  id SERIAL PRIMARY KEY,
  tokens INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE global_user_state (
  wallet TEXT NOT NULL PRIMARY KEY,
  tokens INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE game (
  -- we should not use serial ids. But to do safely, 
  -- we will add a static "serial" identifier 
  -- in the paima concise command: `create|*1`
  id SERIAL NOT NULL PRIMARY KEY,
  stage TEXT NOT NULL DEFAULT 'new',
  wallet TEXT NOT NULL,
  prize INTEGER,
  block_height INTEGER 
);

CREATE TABLE question_answer (
  game_id INTEGER NOT NULL,
  stage TEXT NOT NULL,
  question TEXT,
  answer TEXT,
  message TEXT,
  score FLOAT,
  block_height INTEGER,
  PRIMARY KEY (game_id, stage)
);
