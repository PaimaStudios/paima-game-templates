
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

CREATE TABLE locations (
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  wallet TEXT NOT NULL
);
CREATE INDEX locations_lat_lon ON locations (latitude, longitude);

INSERT INTO locations (latitude, longitude, title, description, wallet)
VALUES 
  (40.7128, -74.0060, 'New York', 'The Big Apple', '0x0'),
  (40.717,-74.0052,'Location1', 'Description', '0x0'),
  (40.7118,-74.0046,'Location2', 'Description', '0x0'),
  (40.702,-73.9986,'Location3', 'Description', '0x0'),
  (40.7088,-74.0038,'Location4', 'Description', '0x0'),
  (40.7156,-74.014,'Location5', 'Description', '0x0'),
  (40.7134,-74.0136,'Location6', 'Description', '0x0'),
  (40.712,-74.0154,'Location7', 'Description', '0x0'),
  (40.7152,-74.0148,'Location8', 'Description', '0x0'),
  (40.7126,-73.9998,'Location9', 'Description', '0x0'),
  (40.7062,-74.0012,'Location10', 'Description', '0x0'),
  (40.7066,-73.9994,'Location11', 'Description', '0x0'),
  (40.7068,-74.0014,'Location12', 'Description', '0x0'),
  (40.7092,-74.0076,'Location13', 'Description', '0x0'),
  (40.7068,-74.0014,'Location14', 'Description', '0x0'),
  (40.7158,-74.0108,'Location15', 'Description', '0x0'),
  (40.7172,-74.0128,'Location16', 'Description', '0x0'),
  (40.721,-74.0092,'Location17', 'Description', '0x0')
;
