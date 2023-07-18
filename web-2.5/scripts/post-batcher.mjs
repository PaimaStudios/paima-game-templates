import { builder } from "paima-sdk/paima-concise";

const BATCHER_URI = process.env.BATCHER_URI;
const BATCHER_API_KEY = process.env.BATCHER_API_KEY;

async function submitToBatcher(input) {
  const data = {
    game_input: input,
    timestamp: new Date().getTime().toString(10),
    api_key: BATCHER_API_KEY,
  };
  const url = `${process.env.BATCHER_URI}/submit_self_signed_input`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();
  if (!response.success) {
    console.error(
      `Batcher rejected input "${data}" with response "${response.message}"`
    );
  }
  console.log({ response });
}

// Check that environment variables are set
if (!BATCHER_URI || !BATCHER_API_KEY) {
  console.error(
    "BATCHER_URI and BATCHER_API_KEY environment variables must be set."
  );
  console.log(
    "Make sure to fill in these values. The default config file is at `../.env.development`"
  );
  console.log(
    "If you wish to use a custom config, set NODE_ENV variable beforehand."
  );
  console.log("Config .env.${NODE_ENV:-development} will then be used.");

  process.exit(1);
}

// Check that command line arguments are provided
const wallet = process.argv[2];
const xpGain = process.argv[3];
if (!wallet || !xpGain) {
  console.error(
    "Invalid command. Please run with \x1b[33mnpm run post -- <wallet> <xpGain>\x1b[0m"
  );
  console.log("For example:");
  console.log(
    "     \x1b[32mnpm run post -- 0x18e1faa3023425dc1f132fd02e8023df5dce6653 10\x1b[0m"
  );

  process.exit(1);
}

/**
 * Example of submitting a gain experience input.
 * This would be constructed on your server after verifying that user met the necessary conditions.
 */
const conciseBuilder = builder.initialize();
conciseBuilder.setPrefix("xp");
conciseBuilder.addValues([
  { value: wallet, isStateIdentifier: true },
  { value: xpGain },
]);
submitToBatcher(conciseBuilder.build());