# Game Frontend

Simple "Frontend" that interacts with the game node using the middleware (`mw`). It allows you to log in and change your nickname. Your experience can be modified only through the batcher (see `post-batcher.mjs` script as a demonstration).

## Prerequisites

Make sure that Paima Engine is running and synced up to current blockheight.

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

If you followed the instructions regarding environment and batcher setup, you should now be able to use the whole flow:

- posting user inputs from the frontend
- posting admin inputs from the server/script
- seeing your player's state changing on the frontend accordingly.
