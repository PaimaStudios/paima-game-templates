# NFT Game Node Template

Following is a basic overview of useful commands and project structure. Each module has it's own `README` file with more detailed information.

## Installation

Install dependencies/initial setup with  
`npm run initialize`

## Building

Compile projects  
`npm run build`

Compile Production/Development Game Node  
`npm run pack`

Compile Javascript Bundle Middleware for the game frontend  
`npm run pack:middleware`

## Prerequisites

paima-sdk and paima-engine-{linux|mac} executable must be in the parent of this project  
`./../paima-sdk`
`./../paima-engine-linux`

## Env Setup:

.env.development or .env.production must be in the parent folder
`./../.env.name`

## Development

To reflect changes in `API` use `npm run compile:api`. This regenerates all `tsoa` routes.

In case of any DB schema or query changes use `npm run compile:db`. This starts a `pgtyped` watcher process that regenerates all of the DB types used in the project.

## Production

Start Database  
`npm run database:up`

Run Game Node  
`cd ..` To parent dir where packaged folder was generated  
`./paima-engine-linux run`
