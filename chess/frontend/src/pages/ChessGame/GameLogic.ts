import { OldResult, LobbyState } from "../../paima/types.d";
import * as Paima from "../../paima/middleware.js";
import * as ChessJS from "chess.js";

export class ChessService {
  // Get Lobby State
  static async getLobbyState(lobbyId: string): Promise<LobbyState | null> {
    const result = await Paima.default.getLobbyState(lobbyId);

    if (result.error) {
      console.error(result);
      return null;
    }

    console.log("Lobby state: ", result.lobby);
    return result.lobby;
  }

  // Submit Moves
  static async submitMove(
    lobbyId: string,
    roundNumber: number,
    move: string
  ): Promise<OldResult> {
    const result = await Paima.default.submitMoves(lobbyId, roundNumber, move);
    console.log("Submit move result: ", result);
    return result;
  }
}

export class ChessLogic {
  userAddress: string;

  constructor(userAddress: string) {
    this.userAddress = userAddress;
  }

  async handleMove(lobbyState: LobbyState, move: string): Promise<void> {
    if (lobbyState == null) {
      throw new Error("Lobby state is null");
    }

    if (this.isThisPlayersTurnRaw(lobbyState) == false) {
      console.log("It's the other player's turn");
      return;
    }

    const moveResult = await ChessService.submitMove(
      lobbyState.lobby_id,
      lobbyState.current_round,
      move
    );
    console.log("Move result: ", moveResult);
    if (moveResult.success === false) {
      console.log("Move failed");
      return;
    }
  }

  isThisPlayersTurnRaw(lobbyState: LobbyState): boolean {
    const chess = new ChessJS.Chess();
    chess.load(lobbyState.latest_match_state);
    const playerColor = this.thisPlayerColor(lobbyState);
    return chess.turn() === playerColor;
  }

  isThisPlayersTurn(lobbyState: LobbyState, chess: ChessJS.Chess): boolean {
    const playerColor = this.thisPlayerColor(lobbyState);
    return chess.turn() === playerColor;
  }

  thisPlayerColor(lobbyState: LobbyState): ChessJS.Color {
    // c|100|100|false|||T
    const isCreator =
      lobbyState.lobby_creator === this.userAddress ? true : false;
    let playerColor: "w" | "b";
    if (isCreator) {
      playerColor = lobbyState.player_one_iswhite ? "w" : "b";
    } else {
      playerColor = lobbyState.player_one_iswhite ? "b" : "w";
    }
    return playerColor;
  }

  gameStateText(lobbyState: LobbyState, waitingConfirmation: boolean): string {
    const chess = new ChessJS.Chess();
    chess.load(lobbyState.latest_match_state);

    if (!lobbyState.player_two) {
      return "Waiting for opponent to join...";
    }

    const thisPlayersTurn = this.isThisPlayersTurn(lobbyState, chess);
    if (chess.isCheckmate()) {
      return `Checkmate! You ${thisPlayersTurn ? "lost" : "won"}.`;
    }

    if (chess.isStalemate()) {
      return "Stalemate! It's a draw.";
    }

    if (waitingConfirmation) {
      return "Waiting for confirmation...";
    }

    if (lobbyState.lobby_state === "finished") {
      return "Match finished.";
    }

    const turn = thisPlayersTurn ? "Your turn" : "Opponent's turn";

    let inCheckText = "";
    const inCheck = chess.inCheck();
    if (inCheck && thisPlayersTurn) {
      inCheckText = " You're in check!";
    } else if (inCheck) {
      inCheckText = " Opponent is in check!";
    }

    const playerColor = this.thisPlayerColor(lobbyState);
    return `You're playing as ${
      playerColor === "w" ? "White" : "Black"
    }. ${turn}.${inCheckText}`;
  }
}
