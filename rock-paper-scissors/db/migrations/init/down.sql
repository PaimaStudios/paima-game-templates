-- Generic paima engine tables, that shouldn't be modified
DROP TABLE block_heights;
DROP TABLE scheduled_data;
DROP TABLE nonces;

-- Extend the schema to fit your needs
DROP TABLE lobbies;
DROP TABLE rounds;
DROP TABLE final_match_state;
DROP TABLE match_moves;
DROP TABLE global_user_state;
DROP TABLE scheduled_data;

DROP TYPE lobby_status
DROP TYPE match_result

DROP FUNCTION update_lobby_round