/* @name updateUserStateCurrentTokenId */
UPDATE global_user_state
SET currentUserTokenId = currentUserTokenId + 1
WHERE wallet = :wallet!
;

/* @name updateDexOrder */
UPDATE dex_order
SET amount = amount - :delta!
WHERE orderId = :orderId!
;

/* @name cancelDexOrder */
UPDATE dex_order
SET amount = 0
WHERE orderId = :orderId!
;

/* @name updateAssetOwnership */
UPDATE asset_token_ownership
SET amount = amount + :delta!
WHERE wallet = :wallet! AND assetTokenId = :assetTokenId!
;