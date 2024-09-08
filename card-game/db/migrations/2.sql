
-- recall: migrations need to be repackaged with `npm run pack` when changed
INSERT INTO global_cards (card) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9);

-- todo: replace https://github.com/PaimaStudios/paima-engine/issues/414
WITH
  new_tick AS (
    INSERT INTO rollup_inputs (from_address, input_data )
    VALUES (
      '0x9bcf794c089d151e8edf1d8a40d9594d432bd494',
      'tick|0'
    )
    RETURNING id AS new_tick_id
  ),
  future_block AS (
    INSERT INTO rollup_input_future_block (id, future_block_height )
    VALUES (
      (SELECT new_tick_id FROM new_tick),
      -- get the latest block + 1
      coalesce((
        SELECT block_height
        FROM paima_blocks
        ORDER BY block_height DESC
        LIMIT 1
      ), 0) + 2
    )
  )
INSERT INTO rollup_input_origin (id, primitive_name, caip2, tx_hash)
SELECT new_tick_id, NULL, NULL, NULL
FROM new_tick
