
/* @name getUser */
SELECT * FROM user_state WHERE wallet = :wallet!;

/* @name getUserItems */
SELECT * FROM user_item WHERE wallet = :wallet!;
