import { Interface } from "ethers";
import { ABI } from "./abi";

const interfacePaimaL2 = new Interface(ABI);
console.log(interfacePaimaL2);

export function getSupplyCalldata(wallet: string, item_id: number, amount: number): string {
  const s = `@pay|${wallet}|${item_id}|${amount}`;
  const payload = '0x' + s.split('').map(x => x.charCodeAt(0).toString(16)).join('');
  return interfacePaimaL2.encodeFunctionData(
    "paimaSubmitGameInput",
    [payload]
  );
}; 

console.log('withdrawFunds', interfacePaimaL2.encodeFunctionData('withdrawFunds', []));