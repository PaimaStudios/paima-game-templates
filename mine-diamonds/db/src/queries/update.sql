/* @name updateUserStateCurrentTokenId */
UPDATE global_user_state
SET currentUserTokenId = currentUserTokenId + 1
WHERE wallet = :wallet!
;

/* @name updateDexOrder */
UPDATE dex_order
SET amount = :newAmount!
WHERE orderId = :orderId!
;