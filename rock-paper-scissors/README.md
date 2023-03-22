# Rock Paper Scissors Wars Game Node Template

## Installation

Install dependencies/initialize the project with  
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
`./../paima-engine`

## Env Setup:

.env.development or .env.production must be in the parent folder
`./../.env.name`

## Development

Changes in /api/src/controllers are rebuild with `npm run compile:api`
Changes in /db/src/queries are rebuild with `npm run compile:db`

## Production

Start Database  
`npm run database:up`

Run Game Node  
`cd ..` To parent dir where packed folder was generated  
`./paima-engine run`
