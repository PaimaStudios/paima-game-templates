import { Controller, Get, Query, Route } from 'tsoa';
import { getLobbyById, requirePool } from '@dice/db';
import type { IGetLobbyByIdResult } from '@dice/db/src/select.queries';

interface Response {
  lobby: IGetLobbyByIdResult | null;
}

@Route('lobby_raw')
export class LobbyRawController extends Controller {
  @Get()
  public async get(@Query() lobbyID: string): Promise<Response> {
    const pool = requirePool();
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    return { lobby };
  }
}
