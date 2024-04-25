/* @name getUserStats */
SELECT * FROM global_user_state
WHERE wallet = :wallet
;

/* @name getUserTokenStats */
SELECT * FROM user_token_state
WHERE wallet = :wallet AND userTokenId = :userTokenId
;