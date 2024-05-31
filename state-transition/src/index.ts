import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { STFSubmittedData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import { clonePaint, insertCanvas, insertPaint, sqlUpdate } from '@game/db';

export default function gameStateTransitionRouter(_blockHeight: number) {
  return async function gameStateTransitionV1(
    inputData: STFSubmittedData,
    _blockHeight: number,
    _randomnessGenerator: Prando,
    dbConn: Pool
  ): Promise<SQLUpdate[]> {
    console.log('inputData =', inputData);

    const expanded = parse(inputData.inputData);
    if (isInvalid(expanded)) {
      console.warn(`Invalid input string`);
      return [];
    }
    console.log('expanded =', expanded);

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

  result.push(sqlUpdate(insertCanvas, { id, owner: body.canvasOwner }));

  if (id == copyFrom) {
    // seed canvas
    for (let i = 0; i < 3; ++i) {
      //const color = '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
      //result.push(sqlUpdate());
    }
  } else {
    // fork
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
