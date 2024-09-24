/* @name getMidnightEVMEvents */
SELECT * FROM midnight_evm_events
WHERE block_height >= :from_block_height
;
