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
WHERE minter = :user AND userTokenId = :userTokenId
;

/* @name getUserValidMintedAssets */
SELECT o.assetTokenId, o.amount FROM asset_token_ownership as o
JOIN asset_token_state as a
ON o.assetTokenId = a.assetTokenId
JOIN user_token_state as u
ON a.minter = u.wallet AND a.userTokenId = u.userTokenId AND a.amount = u.amount
WHERE o.wallet = :user AND u.isDiamond = TRUE AND o.amount <> '0'
;

/* @name getDexOrders */
SELECT * FROM dex_order
WHERE amount <> '0'
;