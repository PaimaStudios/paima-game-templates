import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { STFSubmittedData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import { clonePaint, insertCanvas, insertPaint, sqlUpdate } from '@game/db';

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
        return await newCanvas(inputData, expanded.body);
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
  body: { canvasOwner: string; id: string; copyFrom: string }
): Promise<SQLUpdate[]> {
  const result = [];
  const id = Number(body.id);
  const copyFrom = Number(body.copyFrom);

  if (!inputData.scheduledTxHash) {
    return [];
  }
  result.push(
    sqlUpdate(insertCanvas, { id, owner: body.canvasOwner, txid: inputData.scheduledTxHash })
  );

  if (id == copyFrom) {
    // seed canvas
    console.log('Seed canvas', id);
    for (let i = 0; i < 3; ++i) {
      //const color = '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
      //result.push(sqlUpdate());
    }
  } else {
    // fork
    console.log('Fork canvas', id, 'from', copyFrom, 'by', body.canvasOwner);
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
