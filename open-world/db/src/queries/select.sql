/* @name getLatestBlockData */
SELECT * FROM block_heights 
ORDER BY block_height DESC
LIMIT 1
;

/* @name getLatestProcessedBlockHeight */
SELECT * FROM block_heights 
WHERE done IS TRUE
ORDER BY block_height DESC
LIMIT 1
;

/* @name getBlockData */
SELECT * FROM block_heights 
WHERE block_height = :block_height
;

/* @name getUserStats */
SELECT * FROM global_user_state
WHERE wallet = :wallet
;

/* @name getWorldStats */
SELECT * FROM global_world_state
WHERE can_visit = TRUE
;