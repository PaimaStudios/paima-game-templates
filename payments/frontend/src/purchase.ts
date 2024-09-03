import { parseUnits, Interface } from "ethers";
import { ABI } from "./abi";

const getSupplyCalldata = (amount: number) => {
  if (!amount) return;
  let parsedAmmount = parseUnits(amount.toString(), 8);
  const s = 'pay|100|200|0xeEacBe169AD0EB650E8130fc918e2FDE0d8548b3';
  const payload = '0x' + s.split('').map(x => x.charCodeAt(0).toString(16)).join('');
  return new Interface(ABI).encodeFunctionData(
    "PaimaGameInteraction", 
    // calcu
    [payload]
  );
}; 