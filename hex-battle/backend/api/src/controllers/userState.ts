import { Controller, Get, Query, Route } from 'tsoa';

interface Response {
  state: { wallet: string };
}

@Route('user_state')
export class UserStateController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<Response> {
    return { state: { wallet } };
  }
}
