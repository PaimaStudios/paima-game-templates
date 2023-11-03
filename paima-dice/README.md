# Dice Game Node Template

![image](https://github.com/dcSpark/paima-dice/assets/2608559/92e03aee-6d70-4608-8619-6a26d1fe719c)

You can play a version of this game hosted on the [Oasys](https://oasys.games) testnet.
- Game link [here](https://dice-testnet.paimastudios.com/)
- Faucet [here](https://faucet.sandverse.oasys.games/)
- Demo video (Japanese)  [here](https://youtu.be/WXxX3vq5umQ)
- Blackjack dice rules [here](https://www.youtube.com/watch?v=zcVz-wXYeK8)

This documentation provides a basic overview of the template. Each module has its own `README` file with more detailed information.

## Installation

To install dependencies and perform initial setup, run the following command:

```
npm run initialize
```

This does the following:

- install dependencies of this template
- copies `.env.example` as `.env.development` to the parent folder

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

Ensure that the `paima-sdk` and `paima-engine-{linux|mac}` executable is located in the parent directory of this project. The directory structure should be as follows:

```
this-template
../paima-engine-linux
../.env.$NODE_ENV
```

## Environment Setup

Config file `.env.development` is created during `npm run initialize` in the parent folder, based on `.env.example` in this project. This is an empty file that you need to fill in with your specific values, before running Paima Engine.

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

This modifies your `.env.development` and `docker-compose.yml` files.

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

You can set the `NODE_ENV` variable if you want to load a custom config for your Game Node. For example to load `.env.devnet` use:

```
NODE_ENV=devnet ./paima-engine-linux run
```

## Documentation

If you've got this far you're probably already familiar with our documentation. But if you need to refresh your knowledge you can copy the documentation files to your file system by using the standalone CLI command:

```
./paima-engine-linux docs
```

Or you can visit our [Paima Documentation Website](docs.paimastudios.com) at any time.
