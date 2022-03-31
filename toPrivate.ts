#!/usr/bin/env ts-node

// external imports
const { ApiPromise, WsProvider } = require("@polkadot/api");

const { Keyring } = require("@polkadot/keyring");
const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

// our local stuff
//import * as definitions from './interfaces/definitions';

async function main(): Promise<void> {
  // Initialise the provider to connect to the local node
  const provider = new WsProvider("ws://127.0.0.1:9800");

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });

  // Constuct the keyring after the API (crypto has an async init)
  const keyring = new Keyring({ type: "sr25519" });

  // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
  const alice = keyring.addFromUri("//Alice");

  const post = {
    assetId: 0,
    sources: [1],
    sinks: [],
  };
  
  // Create a extrinsic, transferring 12345 units to Bob
  const asset_metadata = {
    name: [0, 1, 2],
	  symbol: [0, 2, 1],
	  decimals: 0,
	  evmAddress: null,
	  isFrozen: false,
	  minBalance: 1,
	  isSufficient: true,
  };
  //const transfer = api.tx.assetManager.updateAssetMetadata(0, post);
  const transfer = api.tx.mantaPay.toPrivate(post);

  // Sign and send the transaction using our account
  const hash = await transfer.signAndSend(alice);

  console.log("Transfer sent with hash", hash.toHex());
}

main()
  .catch(console.error)
  .finally(() => process.exit());
