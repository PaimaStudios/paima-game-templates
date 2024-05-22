# Mina integration Game Node Template

This documentation provides a basic overview of the template. Each module has its own `README` file with more detailed information.

## Installation

To install dependencies and perform initial setup, run the following command:

```
npm run initialize
```

This does the following:

- install dependencies of this template
- copies `.env.example` as `.env.localhost` to the parent folder

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

## Environment Setup

Config file `.env.localhost` is created during `npm run initialize` in the parent folder, based on `.env.example` in this project. This is an empty file that you need to fill in with your specific values, before running Paima Engine.

Feel free to use examples written in the file for initial testing.

## Contracts

1. Start an EVM local network (Hardhat) using `docker compose up hardhat`. Contracts will be automatically deployed.
2. Start a Mina local network (Lightnet) using `docker compose up mina`.
    1.

## Development

To reflect changes in the API, use the following command to regenerate all `tsoa` routes:

```
npm run compile:api
```

If there are any changes to the DB schema or queries, run `pgtyped` using the following command. It will regenerate all the DB types used in the project:

```
npm run compile:db
npm run compile:db -- -w  # to run in watch mode
```

To speed up the development cycle you can at any time completely reset the EVM and database and start from a fresh local chain:

```
npm run database:reset
```

The Mina Lightnet node is not included because of its long startup time. To reset everything:

```
docker compose down
```

## Production

To start the database in the background, run the command:

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

You can set the `NETWORK` variable if you want to load a custom config for your Game Node. For example to load `.env.localhost` use:

```
NETWORK=localhost ./paima-engine-linux run
```

## Documentation

If you've got this far you're probably already familiar with our documentation. But if you need to refresh your knowledge you can copy the documentation files to your file system by using the standalone CLI command:

```
./paima-engine-linux docs
```

Or you can visit our [Paima Documentation Website](docs.paimastudios.com) at any time.
