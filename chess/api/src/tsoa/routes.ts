/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserStatsController } from './../controllers/userStats';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserLobbiesBlockheightController } from './../controllers/userLobbiesBlockheight';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserLobbiesController } from './../controllers/userLobbies';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SearchOpenLobbiesController } from './../controllers/searchOpenLobbies';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RoundStatusController } from './../controllers/roundStatus';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RoundExecutorController } from './../controllers/roundExecutor';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RandomLobbyController } from './../controllers/randomLobby';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RandomActiveLobbyController } from './../controllers/randomActiveLobby';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OpenLobbiesController } from './../controllers/openLobbies';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MatchWinnerController } from './../controllers/matchWinner';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MatchExecutorController } from './../controllers/matchExecutor';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LobbyStateController } from './../controllers/lobbyState';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IGetUserStatsResult": {
        "dataType": "refObject",
        "properties": {
            "losses": {"dataType":"double","required":true},
            "rating": {"dataType":"double","required":true},
            "ties": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
            "wins": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserStats": {
        "dataType": "refAlias",
        "type": {"ref":"IGetUserStatsResult","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserStatsResponse": {
        "dataType": "refObject",
        "properties": {
            "stats": {"ref":"UserStats","required":true},
            "rank": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetNewLobbiesByUserAndBlockHeightResult": {
        "dataType": "refObject",
        "properties": {
            "lobby_id": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NewLobby": {
        "dataType": "refAlias",
        "type": {"ref":"IGetNewLobbiesByUserAndBlockHeightResult","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserLobbiesBlockheightResponse": {
        "dataType": "refObject",
        "properties": {
            "lobbies": {"dataType":"array","array":{"dataType":"refAlias","ref":"NewLobby"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LobbyStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["closed"]},{"dataType":"enum","enums":["finished"]},{"dataType":"enum","enums":["open"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetAllPaginatedUserLobbiesResult": {
        "dataType": "refObject",
        "properties": {
            "bot_difficulty": {"dataType":"double","required":true},
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "player_two": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "practice": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserLobbiesResponse": {
        "dataType": "refObject",
        "properties": {
            "lobbies": {"dataType":"array","array":{"dataType":"refObject","ref":"IGetAllPaginatedUserLobbiesResult"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetOpenLobbyByIdResult": {
        "dataType": "refObject",
        "properties": {
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISearchPaginatedOpenLobbiesResult": {
        "dataType": "refObject",
        "properties": {
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchOpenLobbiesResponse": {
        "dataType": "refObject",
        "properties": {
            "lobbies": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"IGetOpenLobbyByIdResult"}},{"dataType":"array","array":{"dataType":"refObject","ref":"ISearchPaginatedOpenLobbiesResult"}}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ETHAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CardanoAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PolkadotAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AlgorandAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MinaAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WalletAddress": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ETHAddress"},{"ref":"CardanoAddress"},{"ref":"PolkadotAddress"},{"ref":"AlgorandAddress"},{"ref":"MinaAddress"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundStatusData": {
        "dataType": "refObject",
        "properties": {
            "executed": {"dataType":"boolean","required":true},
            "usersWhoSubmittedMoves": {"dataType":"array","array":{"dataType":"refAlias","ref":"WalletAddress"},"required":true},
            "roundStarted": {"dataType":"double","required":true},
            "roundLength": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundStatusError": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["round not found"]},{"dataType":"enum","enums":["lobby not found"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoundStatusResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"RoundStatusData"},{"ref":"RoundStatusError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLobbyByIdResult": {
        "dataType": "refObject",
        "properties": {
            "bot_difficulty": {"dataType":"double","required":true},
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "player_two": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "practice": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetMovesByLobbyResult": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "move_pgn": {"dataType":"string","required":true},
            "round": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetBlockHeightsResult": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"seed":{"dataType":"string","required":true},"block_height":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundExecutorData": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"ref":"IGetLobbyByIdResult","required":true},
            "match_state": {"dataType":"string","required":true},
            "moves": {"dataType":"array","array":{"dataType":"refObject","ref":"IGetMovesByLobbyResult"},"required":true},
            "block_height": {"ref":"IGetBlockHeightsResult","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundExecutorError": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["lobby not found"]},{"dataType":"enum","enums":["bad round number"]},{"dataType":"enum","enums":["round not found"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoundExecutorResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"RoundExecutorData"},{"ref":"RoundExecutorError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetRandomLobbyResult": {
        "dataType": "refObject",
        "properties": {
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RandomLobbyResponse": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"dataType":"union","subSchemas":[{"ref":"IGetRandomLobbyResult"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetRandomActiveLobbyResult": {
        "dataType": "refObject",
        "properties": {
            "bot_difficulty": {"dataType":"double","required":true},
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "player_two": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "practice": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RandomActiveLobbyResponse": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"dataType":"union","subSchemas":[{"ref":"IGetRandomActiveLobbyResult"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetPaginatedOpenLobbiesResult": {
        "dataType": "refObject",
        "properties": {
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "rating": {"dataType":"double","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OpenLobbiesResponse": {
        "dataType": "refObject",
        "properties": {
            "lobbies": {"dataType":"array","array":{"dataType":"refObject","ref":"IGetPaginatedOpenLobbiesResult"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchWinnerResponse": {
        "dataType": "refObject",
        "properties": {
            "match_status": {"ref":"LobbyStatus"},
            "winner_address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExecutorDataSeed": {
        "dataType": "refObject",
        "properties": {
            "seed": {"dataType":"string","required":true},
            "block_height": {"dataType":"double","required":true},
            "round": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchExecutorData": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"ref":"IGetLobbyByIdResult","required":true},
            "moves": {"dataType":"array","array":{"dataType":"refObject","ref":"IGetMovesByLobbyResult"},"required":true},
            "seeds": {"dataType":"array","array":{"dataType":"refObject","ref":"ExecutorDataSeed"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMatchExecutorResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"MatchExecutorData"},{"dataType":"enum","enums":[null]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LobbyStateQuery": {
        "dataType": "refObject",
        "properties": {
            "bot_difficulty": {"dataType":"double","required":true},
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_round": {"dataType":"double","required":true},
            "hidden": {"dataType":"boolean","required":true},
            "latest_match_state": {"dataType":"string","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "player_one_iswhite": {"dataType":"boolean","required":true},
            "player_two": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "practice": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
            "round_start_height": {"dataType":"double","required":true},
            "remaining_blocks": {"dataType":"nestedObjectLiteral","nestedProperties":{"b":{"dataType":"double","required":true},"w":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetLobbyStateResponse": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"dataType":"union","subSchemas":[{"ref":"LobbyStateQuery"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.get('/user_stats',
            ...(fetchMiddlewares<RequestHandler>(UserStatsController)),
            ...(fetchMiddlewares<RequestHandler>(UserStatsController.prototype.get)),

            async function UserStatsController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserStatsController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user_lobbies_blockheight',
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesBlockheightController)),
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesBlockheightController.prototype.get)),

            async function UserLobbiesBlockheightController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
                    blockHeight: {"in":"query","name":"blockHeight","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserLobbiesBlockheightController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user_lobbies',
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesController)),
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesController.prototype.get)),

            async function UserLobbiesController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
                    count: {"in":"query","name":"count","dataType":"double"},
                    page: {"in":"query","name":"page","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserLobbiesController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/search_open_lobbies',
            ...(fetchMiddlewares<RequestHandler>(SearchOpenLobbiesController)),
            ...(fetchMiddlewares<RequestHandler>(SearchOpenLobbiesController.prototype.get)),

            async function SearchOpenLobbiesController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
                    searchQuery: {"in":"query","name":"searchQuery","required":true,"dataType":"string"},
                    page: {"in":"query","name":"page","dataType":"double"},
                    count: {"in":"query","name":"count","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SearchOpenLobbiesController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/round_status',
            ...(fetchMiddlewares<RequestHandler>(RoundStatusController)),
            ...(fetchMiddlewares<RequestHandler>(RoundStatusController.prototype.get)),

            async function RoundStatusController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
                    round: {"in":"query","name":"round","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new RoundStatusController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/round_executor',
            ...(fetchMiddlewares<RequestHandler>(RoundExecutorController)),
            ...(fetchMiddlewares<RequestHandler>(RoundExecutorController.prototype.get)),

            async function RoundExecutorController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
                    round: {"in":"query","name":"round","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new RoundExecutorController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/random_lobby',
            ...(fetchMiddlewares<RequestHandler>(RandomLobbyController)),
            ...(fetchMiddlewares<RequestHandler>(RandomLobbyController.prototype.get)),

            async function RandomLobbyController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new RandomLobbyController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/random_active_lobby',
            ...(fetchMiddlewares<RequestHandler>(RandomActiveLobbyController)),
            ...(fetchMiddlewares<RequestHandler>(RandomActiveLobbyController.prototype.get)),

            async function RandomActiveLobbyController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new RandomActiveLobbyController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/open_lobbies',
            ...(fetchMiddlewares<RequestHandler>(OpenLobbiesController)),
            ...(fetchMiddlewares<RequestHandler>(OpenLobbiesController.prototype.get)),

            async function OpenLobbiesController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
                    count: {"in":"query","name":"count","dataType":"double"},
                    page: {"in":"query","name":"page","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OpenLobbiesController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/match_winner',
            ...(fetchMiddlewares<RequestHandler>(MatchWinnerController)),
            ...(fetchMiddlewares<RequestHandler>(MatchWinnerController.prototype.get)),

            async function MatchWinnerController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MatchWinnerController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/match_executor',
            ...(fetchMiddlewares<RequestHandler>(MatchExecutorController)),
            ...(fetchMiddlewares<RequestHandler>(MatchExecutorController.prototype.get)),

            async function MatchExecutorController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MatchExecutorController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby_state',
            ...(fetchMiddlewares<RequestHandler>(LobbyStateController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyStateController.prototype.get)),

            async function LobbyStateController_get(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new LobbyStateController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
