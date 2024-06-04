import type { WalletAddress } from '@paima/sdk/utils';

export interface InvalidInput {
  input: 'invalidString';
}

export interface NewCanvasInput {
  input: 'fork';
  body: {
    canvasOwner: string;
    id: string;
    copyFrom: string;
  };
}

export interface PaintInput {
  input: 'paint';
  body: {
    contributor: string;
    canvas: string;
    color: string;
  };
}

export type ParsedSubmittedInput = NewCanvasInput | PaintInput | InvalidInput;
