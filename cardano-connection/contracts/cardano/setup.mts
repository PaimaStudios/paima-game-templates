import wasm from "@dcspark/cardano-multiplatform-lib-nodejs";
import bip39 from "bip39";
console.log(bip39);

const baseWords = "test ".repeat(23) + "sauce";

const rootKey = wasm.Bip32PrivateKey.from_bip39_entropy(
  Buffer.from(bip39.mnemonicToEntropy(baseWords), "hex"),
  Buffer.from(""),
);

for (let i = 0; i < 20; i++) {
  const accountKey = rootKey
    .derive(1852 + 0x80000000)
    .derive(1815 + 0x80000000)
    .derive(i + 0x80000000);
  const paymentKey = accountKey.derive(0).derive(0);
  const stakingKey = accountKey.derive(2).derive(0);

  const baseAddress = wasm.BaseAddress.new(
    wasm.NetworkInfo.preprod().network_id(),
    wasm.Credential.new_pub_key(paymentKey.to_public().to_raw_key().hash()),
    wasm.Credential.new_pub_key(stakingKey.to_public().to_raw_key().hash()),
  );

  console.log(`Account #${i}: ${baseAddress.to_address().to_bech32()}`);
  console.log(`Payment key: ${paymentKey.to_raw_key().to_bech32()}`);
  console.log(`Staking key: ${stakingKey.to_raw_key().to_bech32()}`);
  console.log();
}
