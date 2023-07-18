-- Extend the schema to fit your needs

CREATE TABLE users (
  wallet TEXT NOT NULL PRIMARY KEY,
  name TEXT,
  experience INTEGER NOT NULL DEFAULT 0
);
