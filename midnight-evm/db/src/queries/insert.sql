/* @name insertMidnightEVMEvent */
INSERT INTO midnight_evm_events(
  source,
  raw,
  unix_time,
  block_height
) VALUES (
  :source!,
  :raw!,
  :unix_time!,
  :block_height!
);
