/** Types generated for queries found in "src/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type nft_type = 'air' | 'earth' | 'ether' | 'fire' | 'water';

/** 'GetUserCharacters' parameters type */
export interface IGetUserCharactersParams {
  characters: readonly (string)[];
}

/** 'GetUserCharacters' return type */
export interface IGetUserCharactersResult {
  address: string;
  level: number;
  nft_id: string;
  type: nft_type;
}

/** 'GetUserCharacters' query type */
export interface IGetUserCharactersQuery {
  params: IGetUserCharactersParams;
  result: IGetUserCharactersResult;
}

const getUserCharactersIR: any = {"usedParamSet":{"characters":true},"params":[{"name":"characters","required":true,"transform":{"type":"array_spread"},"locs":[{"a":42,"b":53}]}],"statement":"SELECT * FROM characters \nWHERE nft_id IN :characters!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM characters 
 * WHERE nft_id IN :characters!
 * ```
 */
export const getUserCharacters = new PreparedQuery<IGetUserCharactersParams,IGetUserCharactersResult>(getUserCharactersIR);


