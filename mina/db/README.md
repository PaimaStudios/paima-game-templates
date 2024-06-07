# Database

This package contains all logic that interacts with the Postgres database containing game data. Exports from this package are to be imported by the state transition module.

## Exports

This package exports a `pool` object, which is the Postgres database connection used by nodeJS.

It also exports a series of SQL queries, compiled by the `pgtyped` library.

## pgTyped

[pgTyped](https://github.com/adelsz/pgtyped) generates type safe SQL queries to run on a nodeJS application.

To use it you must write up the queries in `sql` files annotated in pgTyped's custom syntax, and run the CLI.

The CLI can be run with `npm run watch`, which will use Docker to run a temporary Postgres database initialized with `migrations/up.sql` and then watch for query changes. Ctrl+C and restart to reflect changes to `init.sql`.
