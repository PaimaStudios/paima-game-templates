
/* 
  @name createGlobalUserState
*/
INSERT INTO global_user_state (
  wallet
) VALUES (
  :wallet!
)
ON CONFLICT (wallet)
DO NOTHING;


/* @name newGame */
INSERT INTO game (
  wallet
) VALUES (
  :wallet!
);

/* @name newQuestionAnswer */
INSERT INTO question_answer (
 game_id,
 stage,
 question 
) VALUES (
  :game_id!,
  :stage!,
  :question!
);
