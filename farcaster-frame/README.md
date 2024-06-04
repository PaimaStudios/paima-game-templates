# Collaborative Canvas Game

A [Farcaster frame] made for Arbitrum's *[Frame It]* buildathon, using Arbitrum One and [Paima Engine].

[Farcaster frame]: https://docs.farcaster.xyz/learn/what-is-farcaster/frames
[Frame It]: https://arbitrumfoundation.medium.com/introducing-frame-it-an-arbitrum-x-farcaster-buildathon-65c2215c3307
[Paima Engine]: https://paimastudios.com/paima-engine

## How to play

1. Find a posted canvas somewhere on Farcaster that isn't full yet.
2. Choose your own color to **paint**. You can do this as many times as you like.
3. After contributing a color, you may **fork** a canvas and post it to your own timeline.
   * After forking a canvas, new paints to your fork will reward you, which you can withdraw by visiting the post again.
4. If your canvas gets full, find another one to contribute to and then fork!

Price

* Painting costs 25,610 gwei, about [$0.10 USD][price], plus gas.
* 10% goes to the owner of the Canvas Game contract.
* 90% goes to the forker of the canvas you contributed to.

[price]: https://duckduckgo.com/?q=0.000025610+eth+to+usd&ia=cryptocurrency

| Starting state | After seven contributons |
| - | - |
| ![](docs/3-init.webp) | ![](docs/3-7.webp) |

## Development

* `npm run build` to build.
* `npm start` to run locally. Uses Docker for service dependencies and requires `paima-engine` on `$PATH`.
* `npm run debugger` to start [frames.js debugger] pointing at local instance.

[frames.js debugger]: https://framesjs.org/guides/debugger
