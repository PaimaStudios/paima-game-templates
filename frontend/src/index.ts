import express from 'express';
import { button, error, redirect, transaction } from 'frames.js/core';
import { createFrames } from 'frames.js/express';
import { Abi, createPublicClient, encodeFunctionData, getContract, http } from 'viem';
import { anvil } from 'viem/chains';
import paimaL2Abi from '@paima/evm-contracts/abi/PaimaL2Contract.json' with { type: 'json' };
import { voronoi_svg } from './voronoi.js';
import { Resvg } from '@resvg/resvg-js';
import { closest_color } from './colorlist.js';

const app = express();
const frames = createFrames();

app.use(express.static('static'));

const weights: Record<string, number> = {};

app.all(
  '/',
  frames(async ctx => {
    return {
      image: new URL('/1.png', ctx.url).toString(),
      textInput: 'Contribute a color!',
      buttons: [
        button({
          action: 'post',
          label: 'Paint!',
          target: '/post_color',
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
  '/post_color',
  frames(async ctx => {
    // TODO: Would have to verify here because we're taking action based on a POST.
    // But this is just temporary test code so it should be OK.

    const text = ctx.message?.inputText;
    if (text) {
      const result = closest_color(text);
      console.log(text, result);
      if (result.distance <= text.length / 2) {
        weights[result.color] = (weights[result.color] ?? 0) + 1;
      } else {
        return error(`Unknown color "${text.toLowerCase()}". Maybe try "${result.name}"?`);
      }
    }

    return {
      image: new URL('/1.png?' + Math.random(), ctx.url).toString(),
      textInput: 'Contribute a color!',
      buttons: [
        button({
          action: 'post',
          label: 'Paint!',
          target: '/post_color',
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
app.get(
  '/1.png',
  async (req, res) => {
    const svg = voronoi_svg("seed2", weights);
    const pngBytes = new Resvg(svg).render().asPng();

    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    res.contentType('image/png');
    res.send(pngBytes);
  }
)

const port = 3000;
const server = app.listen(port);
console.log(`http://localhost:${port}`);
