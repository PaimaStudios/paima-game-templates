

CREATE TABLE user_state (
  wallet TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE user_item (
  wallet TEXT NOT NULL,
  item_id TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (wallet) REFERENCES user_state(wallet),
  PRIMARY KEY (wallet, item_id)
);