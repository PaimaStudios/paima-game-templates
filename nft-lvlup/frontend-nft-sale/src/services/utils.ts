export const truncateAddress = (address: string): string => {
  const start = address?.slice(0, 5);
  const end = address?.slice(address.length - 5);
  return `${start}...${end}`;
};
