# NFT Game Node Template

This documentation provides a basic overview of the template. Each module has its own `README` file with more detailed information.

## Installation

To install dependencies and perform initial setup, run the following command:

```
npm run initialize
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
../paima-sdk
../paima-engine-linux
../.env
../.extensions.yml
```

## Environment Setup

Place the `.env.development` or `.env.production` file in the parent folder. The file should be named as follows:

```
../.env.name
```

## Development

To reflect changes in the `API`, use the following command to regenerate all `tsoa` routes:

```
npm run compile:api
```

If there are any changes to the DB schema or queries, start the `pgtyped` watcher process using the following command. It will regenerate all the DB types used in the project:

```
npm run compile:db
```

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
