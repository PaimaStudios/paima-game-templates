
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
    node ./quick-start/patch.blockheight.js;
    echo "Launching default settings.";
    echo "It will take a few minutes to build the docker images.";
    echo "";
    docker compose up -d --build --force-recreate
    echo "";
    echo "Open http://localhost:9000 to play the game";
    echo "IMPORTANT: In-game \"metamask\" option will not work in this mode. (batcher is required)";
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
    if [ -f ./quick-start/private.key ]; then 
        echo "./quick-start/private.key exists. Please update this file if required." 
    else 
        echo "Paste your private key (this field will be visible):"
        read private_key
        echo $private_key > ./quick-start/private.key
    fi
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
    docker compose up -d 
fi


# echo "3. Do you want to deploy your own smart contract? [y/N] ";
# echo "You will be required to paste a private-key of a wallet with funds to pay for transaction fees for the target chain.";
# echo "More info at  https://docs.paimastudios.com/home/setup/deploying-l2-smart-contract";
# read answer

# if [ "$answer" != "${answer#[Yy]}" ]; then 
#     ../paima-engine-linux contract # or macos
#     // cd
#     // npm i
#     // npm run ?ll
# fi