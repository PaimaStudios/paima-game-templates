import express from 'express';
import { button, transaction } from 'frames.js/core';
import { createFrames } from 'frames.js/express';

import { Abi, createPublicClient, encodeFunctionData, getContract, http } from 'viem';
import { anvil } from 'viem/chains';
import paimaL2Abi from '@paima/evm-contracts/abi/PaimaL2Contract.json' with { type: 'json' };

const app = express();
const frames = createFrames();

app.use(express.static('static'));

app.all(
  '/',
  frames(async ctx => {
    return {
      image: new URL('/tarochi.jpg', ctx.url).toString(),
      buttons: [
        button({
          action: 'tx',
          label: 'TX',
          target: '/txdata',
          post_url: '/',
        }),
        button({
          action: 'link',
          label: 'Meme',
          target: 'https://example.com',
        }),
      ],
    };
  })
);
app.post(
  '/txdata',
  frames(async ctx => {
    const ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Encode paimaSubmitGameInput call
    const calldata = encodeFunctionData({
      abi: paimaL2Abi,
      functionName: 'paimaSubmitGameInput',
      args: ['48656c6c6f'],  // Hello
    });

    // Query the contract to learn how much the fee is
    const publicClient = createPublicClient({
      chain: anvil,
      transport: http(),
    });
    const paimaL2 = getContract({
      address: ADDRESS,
      abi: paimaL2Abi,
      client: publicClient,
    });
    const fee = await paimaL2.read.fee([]);

    // Return the transaction object to the user
    return transaction({
      //chainId: "eip155:42161", // Arbitrum One
      chainId: "eip155:31337", // Hardhat/Anvil (localhost)
      method: "eth_sendTransaction",
      params: {
        abi: paimaL2Abi as Abi,
        to: ADDRESS, // PaimaL2Contract
        data: calldata,
        value: String(fee),
      }
    });
  })
);
app.post(
  '/txok',
  async (req, res) => {
    console.log(req);
  }
)

/*
const port = 3000;
const server = app.listen(port);
console.log(`http://localhost:${port}`);
// */

//*
import { voronoi_svg } from './voronoi.js';
voronoi_svg("seed2", { "#00007f": 2, "#e01010": 1, "#007f20": 10, "#ffff00": 2, "#ee82ee": 1, "#FF7F00": 1, "#FF9966": 1 , "#6A0DAD": 1 });
// */
