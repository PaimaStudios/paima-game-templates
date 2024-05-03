/* @name updateUserStateCurrentTokenId */
UPDATE global_user_state
SET currentUserTokenId = currentUserTokenId + 1
WHERE wallet = :wallet!
;

/* @name updateDexOrder */
UPDATE dex_order
SET amount = :amount!
;

/* @name updateAssetOwnership */
UPDATE asset_token_ownership
SET amount = amount + :delta!
WHERE wallet = :wallet! AND assetTokenId = :assetTokenId!
;