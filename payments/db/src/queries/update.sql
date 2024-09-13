
/* @name upsertItem */
INSERT INTO user_item 
    (wallet, item_id, amount) 
VALUES 
    (:wallet!, :item_id!, :amount!)
ON CONFLICT 
    (wallet, item_id) 
DO UPDATE SET 
    amount = user_item.amount + EXCLUDED.amount;