import type { CharacterType } from '@game/utils';

export const truncateAddress = (address: string): string => {
  const start = address?.slice(0, 5);
  const end = address?.slice(address.length - 5);
  return `${start}...${end}`;
};

export const characterToNumberMap: Record<CharacterType, number> = {
  air: 0,
  earth: 1,
  fire: 2,
  water: 3,
  ether: 4,
};
