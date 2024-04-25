/* @name updateUserStateCurrentTokenId */
UPDATE global_user_state
SET currentUserTokenId = currentUserTokenId + 1
WHERE wallet = :wallet!
;