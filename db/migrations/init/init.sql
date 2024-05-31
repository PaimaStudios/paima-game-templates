CREATE TABLE canvas (
  id INTEGER NOT NULL PRIMARY KEY,
  owner TEXT NOT NULL
);

CREATE TABLE paint (
  canvas_id INTEGER NOT NULL,
  color TEXT NOT NULL,
  painter TEXT NOT NULL,
  txid TEXT
);
