/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameController } from './../controllers/gameController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LeaderboardController } from './../controllers/leaderboardController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LobbyController } from './../controllers/lobbyController';
import type { RequestHandler } from 'express';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IGetMovesForRoundResult": {
        "dataType": "refObject",
        "properties": {
            "block_height": {"dataType":"double","required":true},
            "id": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "move": {"dataType":"string","required":true},
            "round": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetPlayersByWinsResult": {
        "dataType": "refObject",
        "properties": {
            "draws": {"dataType":"double","required":true},
            "last_block_height": {"dataType":"double","required":true},
            "losses": {"dataType":"double","required":true},
            "played_games": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
            "wins": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetPlayersByGamesPlayedResult": {
        "dataType": "refObject",
        "properties": {
            "draws": {"dataType":"double","required":true},
            "last_block_height": {"dataType":"double","required":true},
            "losses": {"dataType":"double","required":true},
            "played_games": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
            "wins": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetPlayersByLatestResult": {
        "dataType": "refObject",
        "properties": {
            "draws": {"dataType":"double","required":true},
            "last_block_height": {"dataType":"double","required":true},
            "losses": {"dataType":"double","required":true},
            "played_games": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
            "wins": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetOpenLobbiesResult": {
        "dataType": "refObject",
        "properties": {
            "buildings": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "creation_block_height": {"dataType":"double","required":true},
            "gold": {"dataType":"double","required":true},
            "init_tiles": {"dataType":"double","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "num_of_players": {"dataType":"double","required":true},
            "round_limit": {"dataType":"double","required":true},
            "time_limit": {"dataType":"double","required":true},
            "units": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetMyActiveLobbiesResult": {
        "dataType": "refObject",
        "properties": {
            "buildings": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "current_round": {"dataType":"double","required":true},
            "gold": {"dataType":"double","required":true},
            "init_tiles": {"dataType":"double","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "num_of_players": {"dataType":"double","required":true},
            "round_limit": {"dataType":"double","required":true},
            "started_block_height": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "time_limit": {"dataType":"double","required":true},
            "units": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLobbyMapResult": {
        "dataType": "refObject",
        "properties": {
            "lobby_id": {"dataType":"string","required":true},
            "map": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLobbyLeanResult": {
        "dataType": "refObject",
        "properties": {
            "buildings": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "created_at": {"dataType":"datetime","required":true},
            "current_round": {"dataType":"double","required":true},
            "game_winner": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "gold": {"dataType":"double","required":true},
            "init_tiles": {"dataType":"double","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "num_of_players": {"dataType":"double","required":true},
            "round_limit": {"dataType":"double","required":true},
            "started_block_height": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "time_limit": {"dataType":"double","required":true},
            "units": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLobbyPlayersResult": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "player_wallet": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLobbyRoundsResult": {
        "dataType": "refObject",
        "properties": {
            "block_height": {"dataType":"double","required":true},
            "id": {"dataType":"double","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "move": {"dataType":"string","required":true},
            "round": {"dataType":"double","required":true},
            "wallet": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetLatestCreatedLobbyResult": {
        "dataType": "refObject",
        "properties": {
            "current_round": {"dataType":"double","required":true},
            "lobby_creator": {"dataType":"string","required":true},
            "lobby_id": {"dataType":"string","required":true},
            "lobby_state": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "num_of_players": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/game/move',
            ...(fetchMiddlewares<RequestHandler>(GameController)),
            ...(fetchMiddlewares<RequestHandler>(GameController.prototype.getMoveForRound)),

            function GameController_getMoveForRound(request: any, response: any, next: any) {
            const args = {
                    lobby_id: {"in":"query","name":"lobby_id","required":true,"dataType":"string"},
                    round: {"in":"query","name":"round","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new GameController();


              const promise = controller.getMoveForRound.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/game/is_game_over',
            ...(fetchMiddlewares<RequestHandler>(GameController)),
            ...(fetchMiddlewares<RequestHandler>(GameController.prototype.isGameOver)),

            function GameController_isGameOver(request: any, response: any, next: any) {
            const args = {
                    lobby_id: {"in":"query","name":"lobby_id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new GameController();


              const promise = controller.isGameOver.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/wins',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getLeaderboardByWins)),

            function LeaderboardController_getLeaderboardByWins(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LeaderboardController();


              const promise = controller.getLeaderboardByWins.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/played',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getLeaderboardByPlayed)),

            function LeaderboardController_getLeaderboardByPlayed(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LeaderboardController();


              const promise = controller.getLeaderboardByPlayed.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/leaderboard/latest',
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController)),
            ...(fetchMiddlewares<RequestHandler>(LeaderboardController.prototype.getLeaderboardByLatest)),

            function LeaderboardController_getLeaderboardByLatest(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LeaderboardController();


              const promise = controller.getLeaderboardByLatest.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.getOpen)),

            function LobbyController_getOpen(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyController();


              const promise = controller.getOpen.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby/my_games',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.getMyGames)),

            function LobbyController_getMyGames(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyController();


              const promise = controller.getMyGames.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby/map',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.getLobbyMap)),

            function LobbyController_getLobbyMap(request: any, response: any, next: any) {
            const args = {
                    lobby_id: {"in":"query","name":"lobby_id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyController();


              const promise = controller.getLobbyMap.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby/id',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.getLobby)),

            function LobbyController_getLobby(request: any, response: any, next: any) {
            const args = {
                    lobby_id: {"in":"query","name":"lobby_id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyController();


              const promise = controller.getLobby.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/lobby/get_latest_created_lobby',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.getLatestCreatedLobby)),

            function LobbyController_getLatestCreatedLobby(request: any, response: any, next: any) {
            const args = {
                    wallet: {"in":"query","name":"wallet","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LobbyController();


              const promise = controller.getLatestCreatedLobby.apply(controller, validatedArgs as any);
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
