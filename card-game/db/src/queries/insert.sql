
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
