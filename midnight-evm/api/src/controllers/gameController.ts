import { Route, Controller, Get } from 'tsoa';
import { getMidnightEvmEvents, requirePool } from '@midnightevm/db';
@Route('eth_getBalance')
export class EthGetBalanceController extends Controller {
  @Get()
  public async get(): Promise<{ result: string }> {
    const pool = await requirePool()
    const events = await getMidnightEvmEvents.run({ from_block_height: 0 }, pool)
    return { result: (BigInt(events.length) * BigInt(1000000000000000000)).toString(16) };
  }
}

@Route('game')
export class GameController extends Controller {
  @Get()
  public async get(): Promise<{ status: true }> {
    return { status: true };
  }
}
