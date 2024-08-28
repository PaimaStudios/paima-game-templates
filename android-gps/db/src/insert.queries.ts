/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'NewLocation' parameters type */
export interface INewLocationParams {
  description: string;
  latitude: number;
  longitude: number;
  title: string;
  wallet: string;
}

/** 'NewLocation' return type */
export type INewLocationResult = void;

/** 'NewLocation' query type */
export interface INewLocationQuery {
  params: INewLocationParams;
  result: INewLocationResult;
}

const newLocationIR: any = {"usedParamSet":{"latitude":true,"longitude":true,"title":true,"description":true,"wallet":true},"params":[{"name":"latitude","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":104}]},{"name":"longitude","required":true,"transform":{"type":"scalar"},"locs":[{"a":109,"b":119}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":124,"b":130}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":135,"b":147}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":152,"b":159}]}],"statement":"INSERT INTO locations (\n  latitude,\n  longitude,\n  title,\n  description,\n  wallet\n) VALUES (\n  :latitude!,\n  :longitude!,\n  :title!,\n  :description!,\n  :wallet!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO locations (
 *   latitude,
 *   longitude,
 *   title,
 *   description,
 *   wallet
 * ) VALUES (
 *   :latitude!,
 *   :longitude!,
 *   :title!,
 *   :description!,
 *   :wallet!
 * )
 * ```
 */
export const newLocation = new PreparedQuery<INewLocationParams,INewLocationResult>(newLocationIR);


