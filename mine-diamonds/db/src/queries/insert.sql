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
  wallet,
  userTokenId,
  amount
) VALUES (
  :assetTokenId!,
  :wallet!,
  :userTokenId!,
  :amount!
)
ON CONFLICT(assetTokenId)
DO NOTHING;