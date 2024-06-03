/* @name insertCanvas */
INSERT INTO canvas (id, owner, copy_from, seed, txid)
VALUES (:id!, :owner!, :copy_from, :seed!, :txid!);

/* @name getCanvasByTx */
SELECT * FROM canvas
WHERE txid = :txid!;

/* @name getCanvasById */
SELECT * FROM canvas
WHERE id = :id!;

/* @name getCanvasActions
   @param addresses -> (...)
*/
SELECT
    -- canFork = not owner, has painted, and hasn't already forked
    owner NOT IN :addresses
        AND (SELECT COUNT(*) FROM paint WHERE canvas_id = :id AND painter IN :addresses) > 0
        AND (SELECT COUNT(*) FROM canvas WHERE copy_from = :id AND owner IN :addresses) = 0
    AS can_fork
FROM canvas
WHERE id = :id;

/* @name insertPaint */
INSERT INTO paint (canvas_id, color, painter, txid)
VALUES (:canvas_id!, :color!, :painter, :txid);

/* @name clonePaint */
INSERT INTO paint (canvas_id, color, painter, txid)
SELECT :destination, color, painter, txid
FROM paint
WHERE canvas_id = :source!;

/* @name getColors */
SELECT color, painter FROM paint
WHERE canvas_id = :canvas_id!;

/* @name getPaintCount */
SELECT count(*)::INTEGER AS count FROM paint
WHERE canvas_id = :canvas_id!
AND painter IS NOT NULL;

/* @name getPaintByTx */
SELECT * FROM paint
WHERE txid = :txid!;

/* @name getPainter */
SELECT * FROM paint
WHERE canvas_id = :canvas_id
AND painter = :painter!;
