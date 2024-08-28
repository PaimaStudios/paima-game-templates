/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'UpdateLocation' parameters type */
export interface IUpdateLocationParams {
  description: string;
  latitude: number;
  longitude: number;
  title: string;
}

/** 'UpdateLocation' return type */
export type IUpdateLocationResult = void;

/** 'UpdateLocation' query type */
export interface IUpdateLocationQuery {
  params: IUpdateLocationParams;
  result: IUpdateLocationResult;
}

const updateLocationIR: any = {"usedParamSet":{"title":true,"description":true,"latitude":true,"longitude":true},"params":[{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":34,"b":40}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":73}]},{"name":"latitude","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":106}]},{"name":"longitude","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":139}]}],"statement":"UPDATE locations\nSET \n    title = :title!,\n    description = :description!\nWHERE \n    latitude = :latitude! AND \n    longitude = :longitude!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE locations
 * SET 
 *     title = :title!,
 *     description = :description!
 * WHERE 
 *     latitude = :latitude! AND 
 *     longitude = :longitude!
 * ```
 */
export const updateLocation = new PreparedQuery<IUpdateLocationParams,IUpdateLocationResult>(updateLocationIR);


