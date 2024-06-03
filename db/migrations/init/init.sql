CREATE TABLE canvas (
  id INTEGER NOT NULL PRIMARY KEY,
  owner TEXT NOT NULL,
  copy_from INTEGER,
  txid TEXT
);

CREATE TABLE paint (
  canvas_id INTEGER NOT NULL,
  color TEXT NOT NULL,
  painter TEXT,  -- Null for seed paints
  txid TEXT
);
