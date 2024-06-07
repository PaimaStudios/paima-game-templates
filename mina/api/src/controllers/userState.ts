import { Controller, Get, Query, Route } from 'tsoa';

@Route('user_state')
export class UserStateController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<number> {
    // Put your own code here.
    return 1;
  }
}
