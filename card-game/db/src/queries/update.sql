
/* @name flipCard */
UPDATE global_cards
SET upwards = NOT upwards
WHERE card = :card!
;
