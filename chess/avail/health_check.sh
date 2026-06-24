#!/usr/bin/env bash

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}' \
     http://localhost:9944 || exit 1
