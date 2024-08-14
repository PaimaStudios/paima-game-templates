import { Controller, Get, Route } from 'tsoa';
import { requirePool, getDexOrders } from '@game/db';
import type { DexOrder } from '@game/utils';

interface GetDexOrdersResponse {
  stats: DexOrder[];
}

@Route('dex_orders')
export class DexOrdersController extends Controller {
  @Get()
  public async get(): Promise<GetDexOrdersResponse> {
    const pool = requirePool();
    const stats = await getDexOrders.run(undefined, pool);
    return { stats };
  }
}
