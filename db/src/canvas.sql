/* @name insertCanvas */
INSERT INTO canvas (id, owner, copy_from, txid)
VALUES (:id!, :owner!, :copy_from, :txid!);

/* @name getCanvasByTx */
SELECT * FROM canvas
WHERE txid = :txid!;

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

/* @name getPainter */
SELECT * FROM paint
WHERE canvas_id = :canvas_id
AND painter = :painter!;
