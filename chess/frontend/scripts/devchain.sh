#!/bin/bash

echo "This script will start a local ganache-cli instance and deploy the storage contract to it."
echo "Waiting for ganache-cli to start..."
ganache-cli -p 7545 --chainId 5777 -m "focus tomato rural noble staff detail blame satisfy unable hammer smart program" -i 5777 &
pid=$!
echo "ganache-cli PID: $pid"
# wait $pid
sleep 3s
echo "ganache-cli started, continuing..."
cd ../../smart-contract && npx truffle migrate --network ganache && cd ../../chess-web/scripts
