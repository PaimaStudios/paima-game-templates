# Frontend for selling the characters

Make sure you read through our `documentation/4 - deploying-your-stateful-nft.md` first and followed the steps there.

This Frontend NFT Sale App is a simple app to showcase buying NFTs from the previously deployed contract. It uses:

- `tailwindcss` for basic styling
- `typechain` for types generation to interact with the contract
- `wagmi` for the wallet functionality

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

This command executes two tasks:

1. `npm run gen-abi-types`: This task generates types used for interaction with the contract, from the JSON files located in the `./src/abis` directory using the TypeChain library.

2. `vite`: This command starts the development server using Vite.

The app should open in your default browser, or you can access it at `http://localhost:3000` if it doesn't open automatically.

## Configuration

The app automatically loads the configuration from the parent folder of the whole project (the one next to paima-engine created during `npm run initialize`), as specified in the `vite.config.ts` file.

## Characters

Before the contract deployment you specified a list of character NFTs that you wish to sell and their names. The `buyNft` function expects an index value to specify the chosen character during purchase. Related logic is in `services/utils` - namely the list of possible characters and mapping to this index based on the contract deployment.
