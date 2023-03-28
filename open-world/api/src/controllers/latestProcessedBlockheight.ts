import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import { getLatestProcessedBlockHeight, requirePool } from '@game/db';

interface Response {
  block_height?: number;
}

@Route('latest_processed_blockheight')
export class LatestProcessedBlockheightController extends Controller {
  @Get()
  public async get(): Promise<Response> {
    const pool = requirePool();
    const [b] = await getLatestProcessedBlockHeight.run(undefined, pool);
    if (!b) {
      return {};
    }
    return { block_height: b.block_height };
  }
}
