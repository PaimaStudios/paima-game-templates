CREATE TABLE global_user_state (
  wallet TEXT NOT NULL PRIMARY KEY,
  currentUserTokenId INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE user_token_state (
  wallet TEXT NOT NULL,
  userTokenId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  isDiamond BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (wallet, userTokenId)
);
