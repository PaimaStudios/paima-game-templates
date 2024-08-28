/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetLocations' parameters type */
export type IGetLocationsParams = void;

/** 'GetLocations' return type */
export interface IGetLocationsResult {
  description: string;
  latitude: number;
  longitude: number;
  title: string;
  wallet: string;
}

/** 'GetLocations' query type */
export interface IGetLocationsQuery {
  params: IGetLocationsParams;
  result: IGetLocationsResult;
}

const getLocationsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM locations"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM locations
 * ```
 */
export const getLocations = new PreparedQuery<IGetLocationsParams,IGetLocationsResult>(getLocationsIR);


