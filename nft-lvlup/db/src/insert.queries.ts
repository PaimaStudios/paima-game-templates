/** Types generated for queries found in "src/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type nft_type = 'air' | 'earth' | 'ether' | 'fire' | 'water';

/** 'CreateCharacter' parameters type */
export interface ICreateCharacterParams {
  address: string;
  nft_id: string;
  type: nft_type;
}

/** 'CreateCharacter' return type */
export type ICreateCharacterResult = void;

/** 'CreateCharacter' query type */
export interface ICreateCharacterQuery {
  params: ICreateCharacterParams;
  result: ICreateCharacterResult;
}

const createCharacterIR: any = {"usedParamSet":{"address":true,"nft_id":true,"type":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":81}]},{"name":"nft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":86,"b":93}]},{"name":"type","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":108}]}],"statement":"INSERT INTO characters(\n  address,\n  nft_id,\n  level,\n  type)\nVALUES (\n  :address!,\n  :nft_id!,\n  1,\n  :type!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO characters(
 *   address,
 *   nft_id,
 *   level,
 *   type)
 * VALUES (
 *   :address!,
 *   :nft_id!,
 *   1,
 *   :type!
 * )
 * ```
 */
export const createCharacter = new PreparedQuery<ICreateCharacterParams,ICreateCharacterResult>(createCharacterIR);


