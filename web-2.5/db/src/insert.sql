/* 
  @name upsertUser
*/
INSERT INTO users(wallet, name, experience)
VALUES (:wallet!, :name, :experience!)
ON CONFLICT (wallet)
DO UPDATE SET
experience = EXCLUDED.experience,
name = EXCLUDED.name;
