-- Extend the schema to fit your needs
CREATE TYPE nft_type AS ENUM ('fire', 'water', 'earth', 'air', 'ether');

-- verify ownership of the character from cde-access.ts
-- check if it exists (contract address + id)
CREATE TABLE characters (
  address TEXT NOT NULL,
  nft_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  type nft_type NOT NULL,
  PRIMARY KEY (address, nft_id)
);
