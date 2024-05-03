/*
  @name create_global_user_state
*/
INSERT INTO global_user_state (
  wallet
) VALUES (
 :wallet!
)
ON CONFLICT(wallet)
DO NOTHING;

/*
  @name create_user_token_state
*/
INSERT INTO user_token_state (
  wallet,
  userTokenId,
  amount,
  isDiamond
) VALUES (
  :wallet!,
  (SELECT currentUserTokenId FROM global_user_state WHERE wallet = :wallet),
  :amount!,
  :isDiamond!
)
ON CONFLICT (wallet, userTokenId)
DO NOTHING;

/*
  @name create_asset_token_state
*/
INSERT INTO asset_token_state (
  assetTokenId,
  minter,
  userTokenId,
  amount
) VALUES (
  :assetTokenId!,
  :minter!,
  :userTokenId!,
  :amount!
)
ON CONFLICT(assetTokenId)
DO NOTHING;

/*
  @name create_asset_ownership
*/
INSERT INTO asset_token_ownership (
  wallet,
  assetTokenId,
  amount
) VALUES (
  :wallet!,
  :assetTokenId!,
  :amount!
)
ON CONFLICT(wallet, assetTokenId)
DO NOTHING;

/*
  @name create_dex_order
*/
INSERT INTO dex_order (
  orderId,
  seller,
  assetTokenId,
  amount,
  price
) VALUES (
  :orderId!,
  :seller!,
  :assetTokenId!,
  :amount!,
  :price!
)
ON CONFLICT(orderId)
DO NOTHING;