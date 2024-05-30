#!/bin/bash
# Pack build outputs to packaged/ folder. Run separately after tsc 'build'.

set -euo pipefail

BUNDLE_WORKSPACE=api node ./esbuildconfig.cjs
BUNDLE_WORKSPACE=state-transition node ./esbuildconfig.cjs
cp api/src/tsoa/swagger.json ./packaged/openapi.json
