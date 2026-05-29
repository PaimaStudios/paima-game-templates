/* @name getUserStats */
SELECT * FROM global_user_state
WHERE wallet = :wallet
;

/* @name getWorldStats */
SELECT * FROM global_world_state
;

/* @name getGameById */
SELECT * FROM game 
WHERE id = :id!
;

/* @name getNewGame */
SELECT * FROM game
where wallet = :wallet!
and stage = 'new'
;

/* @name getQuestionAnswer */
SELECT * FROM question_answer 
WHERE game_id = :game_id! 
and stage = :stage!
;

/* @name getAllQuestionAnswer */
SELECT * FROM question_answer 
WHERE game_id = :game_id! 
;

