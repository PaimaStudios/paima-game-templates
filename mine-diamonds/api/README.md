# Webserver

This package implements the REST API that serves data from the game node database to the middleware (which is then used by the game frontend).

## How to run

This package uses [tsoa](https://github.com/lukeautry/tsoa) to generate type safe API endpoints.
`tsoa` requires a configuration file, `tsoa.json`. Every endpoint (called "controller" in `tsoa` convention) needs to be a single TypeScript file. To generate the endpoints, you must run the `tsoa` CLI. You can do that by running `npm run compile`.

The CLI will generate a `routes.ts` file, which exports a function called `RegisterRoutes`. The function takes an Express server as its sole argument. This package exports that function, to be imported by the game backend and passed to Paima Engine to run the server.

## Endpoints

### user_stats

Gets data about specified `wallet` -- their `currentusertokenid`, which is the incremental ID counter for the game-side token representation.

| Parameter | Type      | Description                                 |
| :-------- | :-------- | :------------------------------------------ |
| `wallet`  | `string`  | **required**. The user address              |

#### Sample request

```http
http://localhost:3333/user_stats?wallet=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

#### Sample response

```javascript
{
    "stats": {
        "wallet": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "currentusertokenid": 2
    }
}
```

### user_token_state

Gets data about the game-side token representation of specific `userTokenId` of specified `wallet`.

| Parameter     | Type      | Description                                 |
| :------------ | :-------- | :------------------------------------------ |
| `wallet`      | `string`  | **required**. The user address              |
| `userTokenId` | `integer` | **required**. The token id of user          |

#### Sample request

```http
http://localhost:3333/user_token_state?wallet=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266&userTokenId=1
```

#### Sample response

```javascript
{
    "stats": [
        {
            "wallet": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "usertokenid": 1,
            "amount": 3,
            "isdiamond": true
        }
    ]
}
```

### user_asset_state

Gets data about the minted ERC1155 token with specific `userTokenId` of specified `user`.

| Parameter     | Type      | Description                                 |
| :------------ | :-------- | :------------------------------------------ |
| `user`        | `string`  | **required**. The user address              |
| `userTokenId` | `integer` | **required**. The token id of user          |

#### Sample request

```http
http://localhost:3333/user_asset_state?user=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266&userTokenId=1
```

#### Sample response

```javascript
{
    "stats": [
        {
            "assettokenid": 1,
            "minter": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "usertokenid": 1,
            "amount": 3
        }
    ]
}
```

### user_valid_minted_assets

Gets array of ERC1155 token of specified `user` that have been minted in a valid way -- meaning the `amount` and `assetTokenId`/`userTokenId` combination matches.  
This is used by the DEX to get the list of valid assets that user is able to create sell orders for.

| Parameter     | Type      | Description                                 |
| :------------ | :-------- | :------------------------------------------ |
| `user`        | `string`  | **required**. The user address              |

#### Sample request

```http
http://localhost:3333/user_valid_minted_assets?user=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

#### Sample response

```javascript
{
    "stats": [
        {
            "assettokenid": 1,
            "amount": 3
        }
    ]
}
```

### dex_orders

Gets array of created sell orders that are valid -- meaning they have been created with valid minted assets.
This is used by the DEX to get the list of valid sell orders to display to users wanting to buy.

#### Sample request

```http
http://localhost:3333/dex_orders
```

#### Sample response

```javascript
{
    "stats": [
        {
            "orderid": 0,
            "seller": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "assettokenid": 1,
            "amount": 3,
            "price": "2000000000000000000"
        }
    ]
}
```