# -----------------------------------------------------------------------------
FROM alpine:3.18.6 AS build-npm
RUN apk add --no-cache \
    bash \
    npm

# Installing a newer npm helps avert timeouts somehow.
RUN npm install -g npm@10.5.1

# Speed up build by caching node_modules separately.
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------------------------------------------------------
FROM alpine:3.18.6 AS hardhat
RUN apk add --no-cache \
    npm
WORKDIR /src
COPY --from=build-npm /src/node_modules node_modules
COPY contracts/evm contracts/evm
COPY \
    tsconfig.base.json \
    ./
WORKDIR /src/contracts/evm
ENTRYPOINT [ "npx", "hardhat", "node", "--hostname", "0.0.0.0" ]
