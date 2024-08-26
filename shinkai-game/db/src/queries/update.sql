
/* @name updateUserGlobalPosition */
UPDATE global_user_state
SET tokens = tokens + :change!
WHERE wallet = :wallet!
;

/* @name setAnswer */
UPDATE question_answer
SET answer = :answer!, score = :score!
WHERE game_id = :game_id! 
AND stage = :stage!
;

/* @name updateGame */
UPDATE game 
SET 
 stage = :stage!,
 block_height = :block_height!,
 prize = :prize
WHERE 
 id = :id!
;

/* @name updateTokens */
UPDATE global_world_state
set tokens = tokens + :change!
;
