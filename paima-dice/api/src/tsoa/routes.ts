/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
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
import { RandomActiveLobbyController } from './../controllers/randomActiveLobby';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OpenLobbiesController } from './../controllers/openLobbies';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LobbyNFTController } from './../controllers/nfts';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MatchExecutorController } from './../controllers/matchExecutor';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LobbyStateController } from './../controllers/lobbyState';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LobbyRawController } from './../controllers/lobbyRaw';
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IGetUserStatsResult": {
        "dataType": "refObject",
        "properties": {
            "losses": {"dataType":"double","required":true},
            "nft_id": {"dataType":"double","required":true},
            "ties": {"dataType":"double","required":true},
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
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_match": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_proper_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_turn": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "hidden": {"dataType":"boolean","required":true},
            "lobby_creator": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "max_players": {"dataType":"double","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
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
            "current_match": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_proper_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_turn": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "hidden": {"dataType":"boolean","required":true},
            "lobby_creator": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "max_players": {"dataType":"double","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "practice": {"dataType":"boolean","required":true},
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
            "current_match": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_proper_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_turn": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "hidden": {"dataType":"boolean","required":true},
            "lobby_creator": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "max_players": {"dataType":"double","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "practice": {"dataType":"boolean","required":true},
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
    "RoundStatusData": {
        "dataType": "refObject",
        "properties": {
            "executed": {"dataType":"boolean","required":true},
            "usersWhoSubmittedMoves": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "roundStarted": {"dataType":"double","required":true},
            "roundLength": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoundStatusError": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["round not found"]},{"dataType":"enum","enums":["lobby not found"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoundStatusResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"RoundStatusData"},{"ref":"GetRoundStatusError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLobbyByIdResult": {
        "dataType": "refObject",
        "properties": {
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_match": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_proper_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_turn": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "hidden": {"dataType":"boolean","required":true},
            "lobby_creator": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "max_players": {"dataType":"double","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "practice": {"dataType":"boolean","required":true},
            "round_length": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetMatchMovesResult": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "match_within_lobby": {"dataType":"double","required":true},
            "move_within_round": {"dataType":"double","required":true},
            "nft_id": {"dataType":"double","required":true},
            "roll_again": {"dataType":"boolean","required":true},
            "round_within_match": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundExecutorBackendData": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"ref":"IGetLobbyByIdResult","required":true},
            "moves": {"dataType":"array","array":{"dataType":"refObject","ref":"IGetMatchMovesResult"},"required":true},
            "seed": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoundExecutorError": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["lobby not found"]},{"dataType":"enum","enums":["bad round number"]},{"dataType":"enum","enums":["round not found"]},{"dataType":"enum","enums":["match not found"]},{"dataType":"enum","enums":["internal error"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoundExecutorResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"RoundExecutorBackendData"},{"ref":"GetRoundExecutorError"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetRandomActiveLobbyResult": {
        "dataType": "refObject",
        "properties": {
            "created_at": {"dataType":"datetime","required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "current_match": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_proper_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_turn": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "hidden": {"dataType":"boolean","required":true},
            "lobby_creator": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "max_players": {"dataType":"double","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
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
            "current_match": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_proper_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_turn": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "hidden": {"dataType":"boolean","required":true},
            "lobby_creator": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"ref":"LobbyStatus","required":true},
            "max_players": {"dataType":"double","required":true},
            "num_of_rounds": {"dataType":"double","required":true},
            "play_time_per_player": {"dataType":"double","required":true},
            "practice": {"dataType":"boolean","required":true},
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
    "LobbyPlayer": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"score":{"dataType":"double","required":true},"points":{"dataType":"double","required":true},"turn":{"dataType":"union","subSchemas":[{"dataType":"undefined"},{"dataType":"double"}],"required":true},"nftId":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IGetLobbyByIdResult.Exclude_keyofIGetLobbyByIdResult.LobbyStateProps__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"created_at":{"dataType":"datetime","required":true},"creation_block_height":{"dataType":"double","required":true},"hidden":{"dataType":"boolean","required":true},"lobby_creator":{"dataType":"double","required":true},"lobby_id":{"dataType":"string","required":true},"lobby_state":{"ref":"LobbyStatus","required":true},"max_players":{"dataType":"double","required":true},"num_of_rounds":{"dataType":"double","required":true},"play_time_per_player":{"dataType":"double","required":true},"practice":{"dataType":"boolean","required":true},"round_length":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_IGetLobbyByIdResult.LobbyStateProps_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IGetLobbyByIdResult.Exclude_keyofIGetLobbyByIdResult.LobbyStateProps__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PropertiesNonNullable_Pick_IGetLobbyByIdResult.LobbyStateProps__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"current_match":{"dataType":"double","required":true},"current_round":{"dataType":"double","required":true},"current_turn":{"dataType":"double","required":true},"current_proper_round":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LobbyState": {
        "dataType": "refObject",
        "properties": {
            "roundSeed": {"dataType":"string","required":true},
            "players": {"dataType":"array","array":{"dataType":"refAlias","ref":"LobbyPlayer"},"required":true},
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
            "lobby": {"ref":"LobbyState","required":true},
            "moves": {"dataType":"array","array":{"dataType":"refObject","ref":"IGetMatchMovesResult"},"required":true},
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
    "GetLobbyStateResponse": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"dataType":"union","subSchemas":[{"ref":"LobbyState"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetLobbiesRawResponse": {
        "dataType": "refObject",
        "properties": {
            "lobby": {"dataType":"union","subSchemas":[{"ref":"IGetLobbyByIdResult"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/user_stats',
            ...(fetchMiddlewares<RequestHandler>(UserStatsController)),
            ...(fetchMiddlewares<RequestHandler>(UserStatsController.prototype.get)),

            function UserStatsController_get(request: any, response: any, next: any) {
            const args = {
                    nftId: {"in":"query","name":"nftId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserStatsController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user_lobbies_blockheight',
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesBlockheightController)),
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesBlockheightController.prototype.get)),

            function UserLobbiesBlockheightController_get(request: any, response: any, next: any) {
            const args = {
                    nftId: {"in":"query","name":"nftId","required":true,"dataType":"double"},
                    blockHeight: {"in":"query","name":"blockHeight","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserLobbiesBlockheightController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user_lobbies',
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesController)),
            ...(fetchMiddlewares<RequestHandler>(UserLobbiesController.prototype.get)),

            function UserLobbiesController_get(request: any, response: any, next: any) {
            const args = {
                    nftId: {"in":"query","name":"nftId","required":true,"dataType":"double"},
                    count: {"in":"query","name":"count","dataType":"double"},
                    page: {"in":"query","name":"page","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserLobbiesController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/search_open_lobbies',
            ...(fetchMiddlewares<RequestHandler>(SearchOpenLobbiesController)),
            ...(fetchMiddlewares<RequestHandler>(SearchOpenLobbiesController.prototype.get)),

            function SearchOpenLobbiesController_get(request: any, response: any, next: any) {
            const args = {
                    nftId: {"in":"query","name":"nftId","required":true,"dataType":"double"},
                    searchQuery: {"in":"query","name":"searchQuery","required":true,"dataType":"string"},
                    page: {"in":"query","name":"page","dataType":"double"},
                    count: {"in":"query","name":"count","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SearchOpenLobbiesController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/round_status',
            ...(fetchMiddlewares<RequestHandler>(RoundStatusController)),
            ...(fetchMiddlewares<RequestHandler>(RoundStatusController.prototype.get)),

            function RoundStatusController_get(request: any, response: any, next: any) {
            const args = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
                    matchWithinLobby: {"in":"query","name":"matchWithinLobby","required":true,"dataType":"double"},
                    roundWithinMatch: {"in":"query","name":"roundWithinMatch","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RoundStatusController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/round_executor',
            ...(fetchMiddlewares<RequestHandler>(RoundExecutorController)),
            ...(fetchMiddlewares<RequestHandler>(RoundExecutorController.prototype.get)),

            function RoundExecutorController_get(request: any, response: any, next: any) {
            const args = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
                    matchWithinLobby: {"in":"query","name":"matchWithinLobby","required":true,"dataType":"double"},
                    roundWithinMatch: {"in":"query","name":"roundWithinMatch","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RoundExecutorController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/random_active_lobby',
            ...(fetchMiddlewares<RequestHandler>(RandomActiveLobbyController)),
            ...(fetchMiddlewares<RequestHandler>(RandomActiveLobbyController.prototype.get)),

            function RandomActiveLobbyController_get(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RandomActiveLobbyController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/open_lobbies',
            ...(fetchMiddlewares<RequestHandler>(OpenLobbiesController)),
            ...(fetchMiddlewares<RequestHandler>(OpenLobbiesController.prototype.get)),

            function OpenLobbiesController_get(request: any, response: any, next: any) {
            const args = {
                    nftId: {"in":"query","name":"nftId","required":true,"dataType":"double"},
                    count: {"in":"query","name":"count","dataType":"double"},
                    page: {"in":"query","name":"page","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OpenLobbiesController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/nfts/wallet',
            ...(fetchMiddlewares<RequestHandler>(LobbyNFTController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyNFTController.prototype.getWalletNFTs)),

            function LobbyNFTController_getWalletNFTs(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyNFTController();


              const promise = controller.getWalletNFTs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/match_executor',
            ...(fetchMiddlewares<RequestHandler>(MatchExecutorController)),
            ...(fetchMiddlewares<RequestHandler>(MatchExecutorController.prototype.get)),

            function MatchExecutorController_get(request: any, response: any, next: any) {
            const args = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
                    matchWithinLobby: {"in":"query","name":"matchWithinLobby","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MatchExecutorController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby_state',
            ...(fetchMiddlewares<RequestHandler>(LobbyStateController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyStateController.prototype.get)),

            function LobbyStateController_get(request: any, response: any, next: any) {
            const args = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyStateController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby_raw',
            ...(fetchMiddlewares<RequestHandler>(LobbyRawController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyRawController.prototype.get)),

            function LobbyRawController_get(request: any, response: any, next: any) {
            const args = {
                    lobbyID: {"in":"query","name":"lobbyID","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyRawController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
