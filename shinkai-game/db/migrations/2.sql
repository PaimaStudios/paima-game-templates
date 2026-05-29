
-- recall: migrations need to be repackaged with `npm run pack` when changed
INSERT INTO global_world_state (tokens) VALUES (10000);

INSERT INTO scheduled_data (block_height, input_data )
VALUES (
  -- get the latest block + 1
  coalesce((
    SELECT block_height
    FROM block_heights
    ORDER BY block_height DESC
    LIMIT 1
  ), 0) + 2,
  'tick|0'
);

