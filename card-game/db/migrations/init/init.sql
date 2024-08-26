
CREATE TABLE global_user_state (
  wallet TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE global_cards (
  card INTEGER PRIMARY KEY,
  upwards BOOLEAN DEFAULT TRUE
);
