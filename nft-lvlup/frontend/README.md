# Game Frontend

Simple "Frontend" that interacts with the game node using the middleware (`mw`). It allows you to log in, view your owned NFT characters, and level them up.

## Prerequisites

Make sure you bought some Characters with the `frontend-nft-sale` app and followed the prerequisites there.

Also make sure that Paima Engine is running and synced up to current blockheight.

## Installation

To install the dependencies run:

```
npm install
```

## Running the App

To run the app use:

```
npm run dev
```

The underlying setup is mostly the same as in `frontend-nft-sale` (Vite React app reading the config from root parent folder)

If you followed the instruction you should now be able to use the whole flow: posting inputs to paima engine, tracking the state of your NFT and updating the "Game" frontend accordingly.
