CREATE TABLE global_user_state (
  wallet TEXT NOT NULL PRIMARY KEY,
  currentUserTokenId INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE user_token_state (
  wallet TEXT NOT NULL,
  userTokenId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  isDiamond BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (wallet, userTokenId)
);

CREATE TABLE asset_token_state (
  assetTokenId INTEGER PRIMARY KEY,
  wallet TEXT NOT NULL,
  userTokenId INTEGER NOT NULL,
  amount INTEGER NOT NULL
);