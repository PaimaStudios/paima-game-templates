import { Router } from 'express';
import { button, error, redirect, transaction } from 'frames.js/core';
import { createFrames } from 'frames.js/express';
import { Abi, createPublicClient, encodeFunctionData, getContract, http, toHex } from 'viem';
import { anvil } from 'viem/chains';
import paimaL2Abi from '@paima/evm-contracts/abi/PaimaL2Contract.json' with { type: 'json' };
import canvasGameAbi from '@game/evm/CanvasGame';
import { Resvg } from '@resvg/resvg-js';
import { closest_color } from './colorlist.js';
import { voronoi_svg } from './voronoi.js';
import {
  IGetCanvasByTxResult,
  getCanvasActions,
  getCanvasById,
  getCanvasByTx,
  getColors,
  getPaintByTx,
  getPaintCount,
  getPainter,
  requirePool,
} from '@game/db';
import { farcasterHubContext } from 'frames.js/middleware';

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

const seedColorWeight = 1;
const paintWeight = 3;

const aboutUrl = 'https://github.com/PaimaStudios/farcaster-hackathon';

export default function registerApiRoutes(app: Router) {
  const frames = createFrames({
    middleware: [
      farcasterHubContext({
        hubHttpUrl: 'http://localhost:3010/hub',
      }),
    ],
  });

  app.get('/', async (req, res) => {
    res.redirect(aboutUrl);
  });

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
    const db = requirePool();

    const canvas = Number(req.params.canvas);
    const canvasData = (await getCanvasById.run({ id: canvas }, db))[0];
    if (isNaN(canvas) || !canvasData) {
      return error('Canvas does not exist');
    }

    const colorResult = await getColors.run({ canvas_id: canvas }, db);
    // Colors by a human are triple-painted, seed colors are single-painted.
    const colors = colorResult.flatMap(x =>
      Array(x.painter ? paintWeight : seedColorWeight).fill(x.color)
    );

    if (typeof req.query.add === 'string' && /^#[0-9a-f]{6}$/.test(req.query.add)) {
      colors.push(...Array(paintWeight).fill(req.query.add));
    }

    const svg = voronoi_svg(canvasData.seed, colors);
    const pngBytes = new Resvg(svg).render().asPng();

    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    res.contentType('image/png');
    res.send(pngBytes);
  });
  app.post('/:canvas(\\d+)', async (req, res, next) => {
    return frames(async ctx => {
      const db = requirePool();
      const canvas = Number(req.params.canvas);
      // Canvas must exist. Optimistic UI check; the contract enforces this.
      const canvasData = (await getCanvasById.run({ id: canvas }, db))[0];
      if (isNaN(canvas) || !canvasData) {
        return error('Canvas does not exist');
      }
      if (!ctx.message?.isValid) {
        return error('Hub rejected message signature');
      }

      // No need to validate the message because this is just a convenience
      const txid = ctx.message?.transactionId;
      if (req.query.wait && txid) {
        let waitingSucceeded = false;
        console.log('Waiting for', txid);
        const start = new Date().valueOf();
        while (new Date().valueOf() < start + 5_000) {
          await new Promise(resolve => setTimeout(resolve, 100));
          const rows = await getPaintByTx.run({ txid }, db);
          if (rows.length > 0) {
            waitingSucceeded = true;
            break;
          }
        }
        console.log(
          'Waiting took',
          new Date().valueOf() - start,
          'ms, succeeded =',
          waitingSucceeded
        );
      }

      // Based on the user's addresses, can they withdraw and/or fork?
      const addresses = new Set([
        ctx.message?.requesterCustodyAddress,
        ...(ctx.message?.requesterVerifiedAddresses ?? []),
      ].filter(x => x));
      const canFork = (await getCanvasActions.run({ id: canvas, addresses: [...addresses] }, db))[0].can_fork;
      let totalRewards = 0n;
      for (const address of addresses) {
        const rewards = (await canvasGame.read.rewards([address])) as bigint;
        console.log('rewards for', address, 'is', rewards);
        totalRewards += rewards;
      }
      const canWithdraw = totalRewards > 0n;

      // Can only paint if not full. Optimistic UI check; the contract enforces this.
      const paintCount = (await getPaintCount.run({ canvas_id: canvas }, db))[0].count;
      const paintLimit = (await canvasGame.read.paintLimit([])) as number;
      const canPaint = (paintCount ?? 0) < paintLimit;

      return {
        image: new URL(`/${req.params.canvas}.png?${Math.random()}`, ctx.url).toString(),
        textInput: canPaint ? 'Contribute a color!' : undefined,
        buttons: [
          ...(canPaint
            ? [
                button({
                  label: 'Preview...',
                  action: 'post',
                  target: `/${req.params.canvas}/preview`,
                }),
              ]
            : []),
          ...(canFork
            ? [
                button({
                  label: 'Fork!',
                  action: 'tx',
                  target: `/${req.params.canvas}/fork_tx`,
                  post_url: `/fork_ok`,
                }),
              ]
            : []),
          ...(canWithdraw
            ? [
                button({
                  label: 'Withdraw',
                  action: 'tx',
                  target: `/withdraw_tx`,
                  post_url: `/${req.params.canvas}`,
                }),
              ]
            : []),
        ],
      };
    })(req, res, next);
  });
  app.post('/:canvas(\\d+)/preview', async (req, res, next) => {
    return frames(async ctx => {
      // If we were doing anything serious in response to a mere POST, we'd
      // have to verify the frame action: https://framesjs.org/guides/security
      // But this route doesn't actually modify anything, just show a preview.

      const text = ctx.message?.inputText?.trim().toLowerCase();
      if (!text) {
        return error('Type a color to contribute!');
      }

      const result = closest_color(text);
      if (result.distance > text.length / 2) {
        return error(`Unknown color "${text}". Maybe try "${result.name}"?`);
      }
      const color = result.color;

      return {
        image: new URL(
          `/${req.params.canvas}.png?add=${encodeURIComponent(color)}&${Math.random()}`,
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
            label: `Paint ${result.name}!`,
            target: `/${req.params.canvas}/paint_tx?add=${encodeURIComponent(color)}`,
            post_url: `/${req.params.canvas}?wait=1`,
          }),
        ],
      };
    })(req, res, next);
  });
  app.post('/:canvas(\\d+)/paint_tx', async (req, res, next) => {
    return frames(async ctx => {
      const db = requirePool();
      const canvas = Number(req.params.canvas);
      const color = req.query.add;
      // Canvas must exist. Optimistic UI check; the contract enforces this.
      if (isNaN(canvas) || !(await getCanvasById.run({ id: canvas }, db)).length) {
        return error('Canvas does not exist');
      }
      // The contract accepts a uint24 rather than a string, so no enforcement needed.
      if (typeof color !== 'string' || !/^#[0-9a-f]{6}$/.test(color)) {
        return error('Invalid color');
      }

      // Encode paimaSubmitGameInput call
      const calldata = encodeFunctionData({
        abi: canvasGame.abi,
        functionName: 'paint',
        args: [canvas, parseInt(color.substring(1), 16)],
      });

      // Query the contract to learn how much the fee is
      const fee = await canvasGame.read.fee([]);

      // Return the transaction object to the user
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
      const db = requirePool();
      const canvas = Number(req.params.canvas);
      // Canvas must exist. Optimistic UI check; the contract enforces this.
      if (isNaN(canvas) || !(await getCanvasById.run({ id: canvas }, db)).length) {
        return error('Canvas does not exist');
      }

      // Encode call
      const calldata = encodeFunctionData({
        abi: canvasGame.abi,
        functionName: 'fork',
        args: [canvas],
      });

      // Return the transaction object to the user
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
  app.post('/fork_ok', async (req, res, next) => {
    return frames(async ctx => {
      const db = requirePool();

      const txid = ctx.message?.transactionId;
      if (!txid) {
        return error('Expected a transactionId to confirm');
      }

      let rows: IGetCanvasByTxResult[] = [];
      const start = new Date().valueOf();
      while (new Date().valueOf() < start + 5_000) {
        await new Promise(resolve => setTimeout(resolve, 100));
        rows = await getCanvasByTx.run({ txid }, db);
        if (rows.length > 0) {
          break;
        }
      }
      console.log('Waiting took', new Date().valueOf() - start, 'ms, succeeded =', rows.length);

      if (!rows.length) {
        return error("Transaction didn't clear in time");
      }

      const canvas = rows[0].id;

      const embedUrl = new URL(`/${canvas}`, ctx.url);
      // https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents#warpcast-cast-intents
      const linkUrl = new URL('https://warpcast.com/~/compose');
      linkUrl.searchParams.append(
        'text',
        'Contribute your color to my canvas, powered by Paima Engine'
      );
      linkUrl.searchParams.append('embeds[]', embedUrl.toString());

      return {
        image: new URL(`/${canvas}.png?${Math.random()}`, ctx.url).toString(),
        buttons: [
          button({
            label: 'Post so others can paint!',
            action: 'link',
            target: linkUrl.toString(),
          }),
          button({
            label: 'Download',
            action: 'link',
            target: `/${canvas}.png?${Math.random()}`,
          }),
        ],
      };
    })(req, res, next);
  });
  app.post('/withdraw_tx', async (req, res, next) => {
    return frames(async ctx => {
      // Encode call
      const calldata = encodeFunctionData({
        abi: canvasGame.abi,
        functionName: 'withdraw',
        args: [],
      });

      // Return the transaction object to the user
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
