# Cards Game Node Template

You can find the document describing the cryptographic technique used for private cards [here](https://docs.google.com/document/d/1FTXbkeUkDAVDI45KWkmQGFHYqPuSQxiX6wW6mYv0FOY/edit)

This documentation provides a basic overview of the template. Each module has its own `README` file with more detailed information.

## Installation

To install dependencies and perform initial setup, run the following command:

```
npm run initialize
```

This does the following:

- install dependencies of this template
- copies `.env.example` as `.env.localhost` to the parent folder

To deploy contracts, mostly just follow the docs. There is just one nft type, `NULL`, with string `null` (you can change this, but frontend is currently set up like this when selling nfts).

Edit `extensions.yml` and copy it to `..`.

### MacOS specific

If you're using Mac and run into installation issues you can add `--target=esbuild-darwin-arm64` as a workaround to `npm install`. This installs the correct version of a problematic package. For example:

```
npm install --save-dev esbuild@latest --target=esbuild-darwin-arm64
```

## Building

To compile the Game Node into `endpoints` and `gameCode` entrypoints used by Paima Engine, use the following command:

```
npm run pack
```

To compile the JavaScript Bundle of the middleware for the game frontend, run the command:

```
npm run pack:middleware
```

## Prerequisites

Ensure that the `paima-engine-{linux|mac}` executable is located in the parent directory of this project. The directory structure should be as follows:

```
this-template
../paima-engine-linux
../.env
```

### Contracts

This game requires multiple contracts to be deployed to function:

| Name                        | Contract                | Description                                                                                           |
| --------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Game L2 contract            | PaimaL2Contract.sol     | Standard L2 contract that comes with Paima                                                            |
| Account NFT contract        | AnnotatedMintNft.sol    | An account NFT that holds all your trading cards & user data                                          |
| Account NFT mint contract   | NativeNftSale.sol       | Contract to mint new account NFTs                                                                     |
| Account NFT mint proxy      | NativeNftSaleProxy.sol  | Proxy for the account NFT mint contract                                                               |
| Trade NFT contract          | AnnotatedMintNft.sol    | A "trading card" NFT used to list cards on NFT marketplaces without having to sell your whole account |
| Trade NFT mint contract     | NativeNftSale.sol       | Contract to mint new trade NFTs                                                                       |
| Trade NFT native proxy      | NativeNftSaleProxy.sol  | Proxy for the trade NFT mint contract                                                                 |
| Card pack purchase contract | GenericPayment.sol      | Contract to accept payments for buying card packs                                                     |
| Card pack proxy contract    | GenericPaymentProxy.sol | Proxy for the payment contract                                                                        |
|                             |                         |                                                                                                       |

To deploy these scripts,

1. Start a local network using `npm run chain:start`
2. `npm run chain:deploy`

## Environment Setup

Config file `.env.localhost` is created during `npm run initialize` in the parent folder, based on `.env.example` in this project. This is an empty file that you need to fill in with your specific values, before running Paima Engine.

Feel free to use examples written in the file for initial testing.

## Development

To reflect changes in the `API`, use the following command to regenerate all `tsoa` routes:

```
npm run compile:api
```

If there are any changes to the DB schema or queries, start the `pgtyped` watcher process using the following command. It will regenerate all the DB types used in the project:

```
npm run compile:db
```

To speed up the development cycle you can at any time completely reset the database and start syncing from the latest blockheight with:

```
npm run database:reset
```

This modifies your `.env.localhost` and `docker-compose.yml` files.

## Production

To start the database, run the command:

```
npm run database:up
```

To run the Game Node, follow these steps:

1. Change to the parent directory where the packaged folder was generated:

```
cd ..
```

2. Execute the following command:

```
./paima-engine-linux run
```

You can set the `NETWORK` variable if you want to load a custom config for your Game Node. For example to load `.env.testnet` use:

```
NETWORK=testnet ./paima-engine-linux run
```

## Documentation

If you've got this far you're probably already familiar with our documentation. But if you need to refresh your knowledge you can copy the documentation files to your file system by using the standalone CLI command:

```
./paima-engine-linux docs
```

Or you can visit our [Paima Documentation Website](https://docs.paimastudios.com) at any time.
