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
  minter TEXT NOT NULL,
  userTokenId INTEGER NOT NULL,
  amount INTEGER NOT NULL
);

CREATE TABLE asset_token_ownership (
  wallet TEXT NOT NULL,
  assetTokenId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  PRIMARY KEY (wallet, assetTokenId)
);

CREATE TABLE dex_order (
  orderId INTEGER PRIMARY KEY,
  seller TEXT NOT NULL,
  assetTokenId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  price TEXT NOT NULL
);