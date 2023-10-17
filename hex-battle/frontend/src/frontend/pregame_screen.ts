import {
  Tile,
  GameMap,
  Player,
  UnitType,
  BuildingType,
  Moves,
  Hex,
  QRSCoord,
} from '@hexbattle/engine';
import {MapPlayerGame} from '../map-player-game';
import * as mw from '../paima/middleware';
import {BackgroundScreen} from './background_screen';
import {GameScreen} from './game_screen';
import {LoadScreen} from './load_screen';

interface LobbyData {
  lobby: Lobby;
  players: PlayerData[];
  rounds: Round[];
}

interface Lobby {
  lobby_id: string;
  current_round: number;
  created_at: Date;
  creation_block_height: number;
  lobby_creator: string;
  lobby_state: string;
  game_winner: null;
  num_of_players: number;
  units: string;
  buildings: string;
  gold: number;
  init_tiles: number;
  time_limit: number;
  round_limit: number;
  started_block_height: number;
}

interface PlayerData {
  id: number;
  lobby_id: string;
  player_wallet: string;
}

interface Round {
  id: number;
  lobby_id: string;
  wallet: string;
  move: string;
  round: number;
  block_height: number;
}

export class PreGameScreen extends BackgroundScreen {
  drawTimer: any = null;
  fetchTimer: any = null;

  lobby: Lobby | null = null;
  players: PlayerData[] = [];
  rounds: Round[] = [];
  map: QRSCoord[] = [];

  constructor(private lobbyId: string) {
    super();
  }

  events: {
    coord: {x: number; y: number; width: number; height: number};
    callback: () => void;
  }[] = [];

  DrawText(color = '#34495e', shadowOffset = 0) {
    this.ctx.fillStyle = color;
    this.ctx.font = '50px Electrolize';
    this.ctx.textAlign = 'center';
    const text = `Lobby: ${this.lobbyId}`;
    const x = this.canvas.width / 2 + shadowOffset;
    const y = this.canvas.height * 0.25 + 50 + shadowOffset;
    this.ctx.fillText(text, x, y);

    if (!this.events.length) {
      const textMetrics = this.ctx.measureText(text);
      const w =
        Math.abs(textMetrics.actualBoundingBoxLeft) +
        Math.abs(textMetrics.actualBoundingBoxRight);
      const h =
        Math.abs(textMetrics.actualBoundingBoxAscent) +
        Math.abs(textMetrics.actualBoundingBoxDescent);
      const x_ =
        x -
        (Math.abs(textMetrics.actualBoundingBoxLeft) +
          Math.abs(textMetrics.actualBoundingBoxRight)) /
          2;
      const y_ = y - textMetrics.actualBoundingBoxAscent;

      this.events.push({
        coord: {x: x_, y: y_, width: w, height: h},
        callback: () => {
          navigator.clipboard.writeText(this.lobbyId);
          this.setToastMessage('Lobby ID copied to clipboard');
        },
      });
    }

    this.ctx.font = '30px Electrolize';
    this.ctx.fillText(
      'Waiting for players...',
      this.canvas.width / 2 + shadowOffset,
      this.canvas.height * 0.25 + shadowOffset
    );
    let offset = 50;
    let index = 0;
    for (const p of this.players) {
      this.ctx.font = '30px Electrolize';
      offset += 50;
      index += 1;
      const wallet = (p as any).player_wallet;
      const shortWallet = `${wallet.substring(0, 6)}...${wallet.substring(
        wallet.length - 4
      )}`;

      this.ctx.fillText(
        `Player ${index}: ${shortWallet}`,
        this.canvas.width / 2 + shadowOffset,
        this.canvas.height * 0.25 + offset + shadowOffset
      );
    }
  }

  DrawUI() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.DrawBackground();
    this.DrawText('#fff', 2);
    this.DrawText();
    this.DrawToast();
  }

  moveToGame() {
    console.log('moving to game');
    this.DrawUI();
    this.stop();

    const initalGold = this.lobby!.gold;
    const validIds = ['A', 'B', 'C', 'D', 'E'];
    const tiles: Tile[] = this.map
      .map((coord: {q: number; r: number; s: number}) => {
        if (
          coord.q !== parseInt(String(coord.q), 10) ||
          coord.r !== parseInt(String(coord.r), 10) ||
          coord.s !== parseInt(String(coord.s), 10)
        ) {
          console.log('WTF Invalid tile', coord);
          return null;
        }

        return new Tile(coord.q, coord.r, coord.s);
      })
      .filter((x: Tile | null) => !!x) as Tile[];
    const map = new GameMap(tiles);
    map.updateLimits();
    const players = this.players.map(
      (p, i) => new Player(validIds[i], initalGold, p.player_wallet)
    );

    const localWallet = mw.default.getUserWallet(null, () => {
      throw Error('No wallet');
    });

    if (!localWallet.success) throw new Error('Local wallet not found');
    const game = new MapPlayerGame(
      this.lobbyId,
      localWallet.result,
      map,
      players,
      this.lobby!.units.split('') as UnitType[],
      this.lobby!.buildings.split('') as BuildingType[],
      this.lobby!.init_tiles,
      this.lobby!.started_block_height
    );

    this.rounds.forEach((round: Round) => {
      const move = Moves.deserializePaima(game, round);
      game.initMoves(move.player);
      for (const action of move.actions) {
        // 'move' | 'new_unit' | 'new_building';
        if (action.type === 'move') {
          game.moves[move.turn].applyMoveUnit(game, action);
        } else if (action.type === 'new_unit') {
          game.moves[move.turn].applyPlaceUnit(game, action);
        } else if (action.type === 'new_building') {
          game.moves[move.turn].applyPlaceBuilding(game, action);
        }
      }
      game.endTurn();
      game.startBlockheight = round.block_height;
    });

    new LoadScreen(game).start().then(_ => {
      new GameScreen(game, true).start();
      console.log(game);
    });
  }

  async fetchLobby() {
    const lobby = await mw.default.getLobby(this.lobbyId);
    if (lobby.success) {
      const lobbyData: LobbyData = lobby.data as any;
      this.players = lobbyData.players;
      this.lobby = lobbyData.lobby;
      this.rounds = lobbyData.rounds;

      if (this.lobby?.lobby_state === 'active') {
        const map = await mw.default.getLobbyMap(this.lobbyId);
        if (map.success) {
          this.map = JSON.parse((map.data as any).lobby.map);
          this.moveToGame();
        }
      }
    }
  }

  getMousePos(event: any) {
    const x = window.getComputedStyle(
      document.getElementsByClassName('container-zoom')[0]
    );
    const zoom = parseFloat(x.getPropertyValue('zoom'));
    const rect = this.canvas.getBoundingClientRect();
    // console.log({
    //   screen: 'pregame - loading',
    //   zoom,
    //   clientX: event.clientX,
    //   rectLeft: rect.left,
    //   clientY: event.clientY,
    //   rectTop: rect.top,
    // });
    return {
      x: event.clientX / (zoom || 1) - rect.left,
      y: event.clientY / (zoom || 1) - rect.top,
    };
  }

  mouse_hover_event = (evt: Event) => {
    const mousePos = this.getMousePos(evt);
    // const trigger = this.events.find(e =>
    //   this.isInButton(mousePos.x, mousePos.y, e.coord)
    // );
    // if (trigger) {
    // this.canvas.style.cursor = 'pointer';
    // this.hover = null;
    // } else {
    this.canvas.style.cursor = 'default';
    this.hover = Hex.pixel_to_pointy_hex(mousePos, 20);
    // }
  };

  mouse_click_event = (evt: Event) => {
    const mousePos = this.getMousePos(evt);
    this.events.forEach(e => {
      if (this.isInButton(mousePos.x, mousePos.y, e.coord)) {
        e.callback();
      }
    });
  };

  isInButton(
    x: number,
    y: number,
    coord: {x: number; y: number; width: number; height: number}
  ) {
    if (
      x > coord.x &&
      x < coord.x + coord.width &&
      y > coord.y &&
      y < coord.y + coord.height
    ) {
      return true;
    }
    return false;
  }

  async start() {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const url = new URL(window.location.href);
    if (!url.searchParams.has('lobby')) {
      window.location.href = window.location.href + '?lobby=' + this.lobbyId;
    }

    this.canvas.addEventListener('mousemove', this.mouse_hover_event);
    this.canvas.addEventListener('click', this.mouse_click_event);
    this.drawTimer = setInterval(() => this.DrawUI(), 33);

    await this.fetchLobby();
    if (this.lobby?.lobby_state === 'active') {
      // do not start timer.
    } else {
      this.fetchTimer = setInterval(() => this.fetchLobby(), 10000);
    }
  }

  async stop() {
    this.canvas.removeEventListener('mousemove', this.mouse_hover_event);
    this.canvas.removeEventListener('click', this.mouse_click_event);
    clearInterval(this.drawTimer);
    clearInterval(this.fetchTimer);
  }
}
