import {UnitType, BuildingType, AIPlayer} from './engine';

import {RandomGame} from './random-game';
import {firstLoad} from './frontend/load';
import {init, start} from './frontend/main_loop';
(async () => {
  // DEMO SETUP
  const players = 1;
  const AIPlayers = 4;
  const initalNumberOfTitlesPerPlayer = 5;
  const game = new RandomGame(
    players,
    AIPlayers,
    'large',
    [UnitType.UNIT_1, UnitType.UNIT_2],
    [BuildingType.BASE, BuildingType.FARM],
    initalNumberOfTitlesPerPlayer,
    10,
    0.24
  );

  // This shows loading screen and loads assets
  await firstLoad(game);
  await init(game);
  await start(game);

  if (game.turn === 0) {
    const player = game.getCurrentPlayer();
    if (player instanceof AIPlayer) {
      setTimeout(() => player.randomMove(game), 1000);
    }
  }
})();
