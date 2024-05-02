/* @name getUserStats */
SELECT * FROM global_user_state
WHERE wallet = :wallet
;

/* @name getUserTokenStats */
SELECT * FROM user_token_state
WHERE wallet = :wallet AND userTokenId = :userTokenId
;

/* @name getUserAssetStats */
SELECT * FROM asset_token_state
WHERE wallet = :wallet AND userTokenId = :userTokenId
;

/* @name getUserValidMintedAssets */
SELECT a.assetTokenId, a.amount FROM asset_token_state as a JOIN user_token_state as u
ON a.wallet = u.wallet AND a.userTokenId = u.userTokenId AND a.amount = u.amount
WHERE a.wallet = :wallet AND u.isDiamond = TRUE
;