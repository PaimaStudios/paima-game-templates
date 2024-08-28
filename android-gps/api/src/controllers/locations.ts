import { Controller, Get, Route } from 'tsoa';
import { requirePool, getLocations, IGetLocationsResult } from '@game/db';

@Route('locations')
export class LocationController extends Controller {
  @Get()
  public async get(): Promise<{stats: IGetLocationsResult[]}> {
    const pool = requirePool();
    const stats = await getLocations.run(undefined, pool);
    return { stats };
  }
}
