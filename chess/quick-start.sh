
echo ""
echo "Welcome to Paima-Engine quickstart"
echo ""

# Check dependencies
if ! [ -f ../paima-engine-linux ]; then
  echo "\"paima-engine-linux\" must exist in the parent folder";
  echo "Download \"paima-engine-linux\" from https://github.com/PaimaStudios/paima-engine/";
  exit;
fi

if ! [ -x "$(command -v docker)" ]; then
    echo "For the quick start you require \"docker\" installed";
    echo "Please install docker first from https://docs.docker.com/engine/install/";
    exit;
fi

if ! [ -x "$(command -v node)" ]; then
    echo "For the quick start you require \"node\" installed";
    echo "Please install node first from https://nodejs.org/ or https://github.com/nvm-sh/nvm/";
    exit;
fi

# Run in default mode
printf '1. Do you want to build & deploy the game in testnet with default settings? [Y/n] '
read answer

if ! [ "$answer" != "${answer#[Nn]}" ]; then 
    cp ./quick-start/.env.docker.template ./quick-start/.env.docker
    node ./quick-start/patch.blockheight.js;
    echo "Launching default settings.";
    echo "It will take a few minutes to build the docker images.";
    echo "";
    docker compose up -d --build --force-recreate
    echo "";
    echo "Open http://localhost:9000 to play the game";
    echo "IMPORTANT: You must use \"EVM Self Sequencing\" to play, as no batcher has been deployed";
    echo "";
    echo "run \"docker compose down\" to stop the game";
    echo "run \"docker compose logs -f\" to view the logs";
    echo "run \"docker compose up -d\" to restart without rebuilding"; 
    echo "";
    exit;
fi

# Setup Batcher mode
echo "";
echo "2. Do you want to launch a batcher? [y/N] "
echo "You will be required to paste a private-key of a wallet with funds to pay for transaction fees for the target chain.";
echo "More info at https://docs.paimastudios.com/home/setup/paima-bacher"
read answer

BATCHER=false
if [ "$answer" != "${answer#[Yy]}" ]; then 
    BATCHER=true
    if [ -f ./quick-start/batcher-private.key ]; then 
        echo "./quick-start/batcher-private.key exists. Please update this file if required." 
    else 
        echo "Paste your private key (this field will be visible):"
        read batcher_private_key
        echo $batcher_private_key > ./quick-start/batcher-private.key
    fi
fi

cp ./quick-start/.env.docker.template ./quick-start/.env.docker

echo "3. Do you want to deploy your own smart contract? [y/N] ";
echo "You will be required to paste a private-key of a wallet with funds to pay for transaction fees for the target chain.";
echo "More info at  https://docs.paimastudios.com/home/setup/deploying-l2-smart-contract";
read answer

if [ "$answer" != "${answer#[Yy]}" ]; then
    echo "";
    echo "Required field to publish the smart contract:"
    echo "3.a Paste your wallet address (e.g., 0xeEacBe169AD0EB650E8130fc918e2FDE0d8548b3)" ;
    read wallet
    echo "3.b RPC URL (e.g., https://rpc-devnet-cardano-evm.c1.milkomeda.com):" ;
    read rpc_url
    echo "3.c Chain ID (e.g., 200101):" ;
    read chain_id
    echo "3.d Paste your private key (this field will be visible):" ;
    read private_key
    echo "";
    tag=`echo $RANDOM | md5sum | head -c 20; echo`
    docker build -f quick-start/Dockerfile.contract \
                --build-arg="PRIVATE_KEY=$private_key" \
                --build-arg="CHAIN_ID=$chain_id" \
                --build-arg="RPC_URL=$rpc_url" \
                --build-arg="WALLET=$wallet" \
                --tag="l2-contract:1.0.0" ../

    docker run l2-contract:1.0.0
    echo "";
    echo "3.e Please paste \"contract address\" from the above output (e.g., 0xD351Cce7170E0dA60f0ed081658E428Ef0fc7687)";
    read contract_address
    echo "";
    CONTRACT_ADDRESS=${contract_address} CHAIN_ID=${chain_id} CHAIN_URI=${rpc_url} node quick-start/env.docker.patcher.js
fi

if $BATCHER; then
    node ./quick-start/patch.blockheight.js;
    echo "Launching batcher mode.";
    echo "It will take a few minutes to build the docker images.";
    echo "";
    docker compose --profile batcher up -d --build --force-recreate 
    echo "";
    echo "Open http://localhost:9000 to play the game";
    echo "";
    echo "run \"docker compose --profile batcher down\" to stop the game";
    echo "run \"docker compose logs -f\" to view the logs";
    echo "run \"docker compose --profile batcher up -d\" to restart without rebuilding"; 
    echo "";
    exit;
else
    cp ./quick-start/.env.docker.template ./quick-start/.env.docker
    node ./quick-start/patch.blockheight.js;
    echo "Launching default settings with batcher";
    echo "It will take a few minutes to build the docker images.";
    echo "";
    docker compose up -d --build --force-recreate
    echo "";
    echo "Open http://localhost:9000 to play the game";
    echo "IMPORTANT: You must use \"EVM Self Sequencing\" to play, as no batcher has been deployed";
    echo "";
    echo "run \"docker compose down\" to stop the game";
    echo "run \"docker compose logs -f\" to view the logs";
    echo "run \"docker compose up -d\" to restart without rebuilding"; 
    echo "";
    exit;
fi
