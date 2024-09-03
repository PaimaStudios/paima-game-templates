import { Controller, Get, Query, Route } from 'tsoa';
import type { IGetUserItemsResult } from '@game/db';
import { getUserItems, requirePool } from '@game/db';

@Route('items')
export class LocationController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<{ stats: IGetUserItemsResult[] }> {
    const pool = requirePool();
    const stats = await getUserItems.run({ wallet: wallet.toLocaleLowerCase() }, pool);
    return { stats };
  }
}
