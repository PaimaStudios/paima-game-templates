import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { STFSubmittedData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import { clonePaint, getCanvasById, insertCanvas, insertPaint, rngForCanvas, sqlUpdate } from '@game/db';

export default function gameStateTransitionRouter(blockHeight: number) {
  return async function gameStateTransitionV1(
    inputData: STFSubmittedData,
    blockHeight: number,
    randomnessGenerator: Prando,
    db: Pool
  ): Promise<SQLUpdate[]> {
    const expanded = parse(inputData.inputData);
    if (isInvalid(expanded)) {
      console.warn('Invalid input string:', inputData.inputData);
      return [];
    }

    switch (expanded.input) {
      case 'fork':
        return await newCanvas(inputData, expanded.body, db);
      case 'paint':
        return await paint(inputData, expanded.body);
      default:
        assertNever(expanded);
    }
  };
}

function assertNever(value: never): never {
  throw new Error('Unhandled discriminated union member: ' + JSON.stringify(value));
}

async function newCanvas(
  inputData: STFSubmittedData,
  body: { canvasOwner: string; id: string; copyFrom: string },
  db: Pool
): Promise<SQLUpdate[]> {
  const result = [];
  const id = Number(body.id);
  const copyFrom = Number(body.copyFrom);

  if (!inputData.scheduledTxHash) {
    return [];
  }

  if (id == copyFrom) {
    // seed canvas
    console.log('Seed canvas', id);

    result.push(
      sqlUpdate(insertCanvas, {
        id,
        owner: body.canvasOwner,
        copy_from: id == copyFrom ? null : copyFrom,
        seed: `${id}`,
        txid: inputData.scheduledTxHash,
      })
    );

    const rand = rngForCanvas(id);
    for (let i = 0; i < 3; ++i) {
      let color = '#';
      for (let j = 0; j < 6; ++j) {
        color += '0123456789abcdef'[Math.floor(rand() * 16)];
      }
      result.push(
        sqlUpdate(insertPaint, { canvas_id: id, color, txid: inputData.scheduledTxHash })
      );
    }
  } else {
    // fork
    console.log('Fork canvas', id, 'from', copyFrom, 'by', body.canvasOwner);

    const basedOn = (await getCanvasById.run({ id: copyFrom }, db))[0];

    result.push(
      sqlUpdate(insertCanvas, {
        id,
        owner: body.canvasOwner,
        copy_from: id == copyFrom ? null : copyFrom,
        seed: basedOn.seed,
        txid: inputData.scheduledTxHash,
      })
    );

    result.push(sqlUpdate(clonePaint, { source: copyFrom, destination: id }));
  }

  return result;
}

async function paint(
  inputData: STFSubmittedData,
  body: { contributor: string; canvas: string; color: string }
): Promise<SQLUpdate[]> {
  const result = [];
  const canvas = Number(body.canvas);
  const color = '#' + Number(body.color).toString(16).padStart(6, '0');
  console.log('Paint', color, 'on', canvas, 'by', body.contributor);

  result.push(
    sqlUpdate(insertPaint, {
      canvas_id: canvas,
      color: color,
      painter: body.contributor,
      txid: inputData.scheduledTxHash,
    })
  );

  return result;
}
