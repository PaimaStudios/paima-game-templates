/* @name insertCanvas */
INSERT INTO canvas (id, owner)
VALUES (:id!, :owner!);

/* @name insertPaint */
INSERT INTO paint (canvas_id, color, painter, txid)
VALUES (:canvas_id!, :color!, :painter, :txid);

/* @name clonePaint */
INSERT INTO paint (canvas_id, color, painter, txid)
SELECT :destination, color, painter, txid
FROM paint
WHERE canvas_id = :source!;

/* @name getColors */
SELECT color FROM paint
WHERE canvas_id = :canvas_id!;

/* @name getPaintByTx */
SELECT * FROM paint
WHERE txid = :txid!;
