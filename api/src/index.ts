import { Router } from 'express';
import { RegisterRoutes } from './tsoa/routes.js';
import { button, error, redirect, transaction } from 'frames.js/core';
import { createFrames } from 'frames.js/express';
import { Abi, createPublicClient, encodeFunctionData, getContract, http, toHex } from 'viem';
import { anvil } from 'viem/chains';
import paimaL2Abi from '@paima/evm-contracts/abi/PaimaL2Contract.json' with { type: 'json' };
import canvasGameAbi from '@game/evm/CanvasGame';
import { Resvg } from '@resvg/resvg-js';
import { closest_color } from './colorlist.js';
import { voronoi_svg } from './voronoi.js';

const chain = anvil;
const chainId = `eip155:${chain.id}`;

const publicClient = createPublicClient({
  chain,
  transport: http(),
});

const paimaL2 = getContract({
  abi: paimaL2Abi as Abi,
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  client: publicClient,
});

const canvasGame = getContract({
  abi: canvasGameAbi as unknown as Abi,
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  client: publicClient,
});

export default function registerApiRoutes(app: Router) {
  RegisterRoutes(app);

  const frames = createFrames();

  const weights: Record<string, number> = {};

  app.get('/:canvas(\\d+)', async (req, res, next) => {
    return frames(async ctx => {
      return {
        image: new URL(`/${req.params.canvas}.png`, ctx.url).toString(),
        buttons: [
          button({
            action: 'post',
            label: 'See full canvas...',
            target: `/${req.params.canvas}`,
          }),
        ],
      };
    })(req, res, next);
  });
  app.get('/:canvas(\\d+).png', async (req, res) => {
    let localWeights = weights;
    if (typeof req.query.add === 'string') {
      localWeights = Object.fromEntries(Object.entries(weights));
      localWeights[req.query.add] = (localWeights[req.query.add] ?? 0) + 1;
    }

    const svg = voronoi_svg(req.params.canvas, localWeights);
    const pngBytes = new Resvg(svg).render().asPng();

    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    res.contentType('image/png');
    res.send(pngBytes);
  });
  app.post('/:canvas(\\d+)', async (req, res, next) => {
    return frames(async ctx => {
      console.log('/:canvas wait=', req.query.wait);
      const canFork = true; // TODO

      const forkButton = canFork
        ? [
            button({
              label: 'Fork!',
              action: 'tx',
              target: `/${req.params.canvas}/fork_tx`,
            }),
          ]
        : [];

      return {
        image: new URL(
          `/${req.params.canvas}.png?${Math.random()}` + Math.random(),
          ctx.url
        ).toString(),
        textInput: 'Contribute a color!',
        buttons: [
          button({
            label: 'Preview...',
            action: 'post',
            target: `/${req.params.canvas}/preview`,
          }),
          ...forkButton,
        ],
      };
    })(req, res, next);
  });
  app.post('/:canvas(\\d+)/preview', async (req, res, next) => {
    return frames(async ctx => {
      // TODO: Would have to verify here because we're taking action based on a POST.
      // But this is just temporary test code so it should be OK.

      const text = ctx.message?.inputText;
      let color: string;
      if (text) {
        const result = closest_color(text);
        if (result.distance <= text.length / 2) {
          color = result.color;
        } else {
          return error(`Unknown color "${text.toLowerCase()}". Maybe try "${result.name}"?`);
        }
      } else {
        return error('Type a color to contribute!');
      }

      /*
        const embedUrl = new URL('/' + Math.random(), ctx.url);
        // https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents#warpcast-cast-intents
        const linkUrl = new URL('https://warpcast.com/~/compose');
        linkUrl.searchParams.append('text', 'Contribute your color to my canvas, powered by Paima Engine');
        linkUrl.searchParams.append('embeds[]', embedUrl.toString());
        */

      return {
        image: new URL(
          `/${req.params.canvas}.png?add=${encodeURIComponent(color)}&' + ${Math.random()}`,
          ctx.url
        ).toString(),
        textInput: 'Try a different color...',
        buttons: [
          button({
            action: 'post',
            label: 'Preview...',
            target: `/${req.params.canvas}/preview`,
          }),
          button({
            action: 'tx',
            label: 'Paint it!',
            target: `/${req.params.canvas}/paint_tx?add=${encodeURIComponent(color)}`,
            post_url: `/${req.params.canvas}?wait=1`,
          }),
        ],
      };
    })(req, res, next);
  });
  app.post('/:canvas(\\d+)/paint_tx', async (req, res, next) => {
    return frames(async ctx => {
      const canvas = Number(req.params.canvas);
      const color = req.query.add;
      if (isNaN(canvas) || typeof color !== 'string' || !/^#[0-9a-f]{6}$/.test(color)) {
        return error('Invalid input');
      }

      // Encode paimaSubmitGameInput call
      const calldata = encodeFunctionData({
        abi: canvasGame.abi,
        functionName: 'paint',
        args: [
          canvas,
          parseInt(color.substring(1), 16),
        ],
      });

      // Query the contract to learn how much the fee is
      const fee = await canvasGame.read.fee([]);

      // Return the transaction object to the user
      console.log('returning tx object from /paint_tx');
      return transaction({
        chainId,
        method: 'eth_sendTransaction',
        params: {
          abi: canvasGame.abi,
          to: canvasGame.address,
          data: calldata,
          value: String(fee),
        },
      });
    })(req, res, next);
  });
  app.post('/:canvas(\\d+)/fork_tx', async (req, res, next) => {
    return frames(async ctx => {
      const canvas = Number(req.params.canvas);
      if (isNaN(canvas)) {
        return error('Invalid input');
      }

      // Encode call
      const calldata = encodeFunctionData({
        abi: canvasGame.abi,
        functionName: 'fork',
        args: [canvas],
      });

      // Return the transaction object to the user
      console.log('returning tx object from /fork_tx');
      return transaction({
        chainId,
        method: 'eth_sendTransaction',
        params: {
          abi: canvasGame.abi,
          to: canvasGame.address,
          data: calldata,
        },
      });
    })(req, res, next);
  });
}
