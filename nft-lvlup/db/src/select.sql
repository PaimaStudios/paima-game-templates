/*
  @name getUserCharacters
  @param characters -> (...)
*/
SELECT * FROM characters 
WHERE nft_id IN :characters!;