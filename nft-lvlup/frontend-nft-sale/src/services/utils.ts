export const truncateAddress = (address: string): string => {
  const start = address?.slice(0, 5);
  const end = address?.slice(address.length - 5);
  return `${start}...${end}`;
};

export type Characters = typeof characters[number];
export const characters = ['fire', 'water', 'earth', 'air', 'ether'] as const;

export const characterToNumberMap: Record<Characters, number> = {
  fire: 0,
  water: 1,
  earth: 2,
  air: 3,
  ether: 4,
};
