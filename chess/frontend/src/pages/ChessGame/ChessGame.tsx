import React, { useContext, useEffect, useState } from "react";
import "./ChessGame.scss";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { LobbyState, TickEvent } from "../../paima/types.d";
import { ChessLogic, ChessService } from "./GameLogic";

import { Chessboard } from "react-chessboard";
import * as ChessJS from "chess.js";
import Navbar from "@src/components/Navbar";
import MainController from "@src/MainController";
import { AppContext } from "@src/main";

interface ChessGameProps {
  lobby: LobbyState;
  address: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTickEvent(event: any): event is TickEvent {
  return (event as TickEvent).pgn_move !== undefined;
}

const ChessGame: React.FC<ChessGameProps> = ({ lobby, address }) => {
  const mainController: MainController = useContext(AppContext);

  const [game, setGame] = useState(new ChessJS.Chess());
  const [showMore, setShowMore] = useState(false);
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const [replayInProgress, setReplayInProgress] = useState(false);
  const [lobbyState, setLobbyState] = useState<LobbyState>(lobby);
  const chessLogic = new ChessLogic(address);

  useEffect(() => {
    setGame(new ChessJS.Chess(lobby.latest_match_state));
  }, []);

  useEffect(() => {
    const fetchLobbyData = async () => {
      if (waitingConfirmation || replayInProgress) return;
      const lobbyState = await ChessService.getLobbyState(lobby.lobby_id);
      if (lobbyState == null) return;
      setLobbyState(lobbyState);
      setGame(new ChessJS.Chess(lobbyState.latest_match_state));
    };

    // Fetch data every 5 seconds
    const intervalIdLobby = setInterval(fetchLobbyData, 5 * 1000);

    // Clean up the interval when component unmounts
    return () => {
      clearInterval(intervalIdLobby);
    };
  }, [waitingConfirmation, replayInProgress, lobbyState]);
  //TODO: add eslint react hooks

  async function handleMove(move: string): Promise<void> {
    setWaitingConfirmation(true);
    await chessLogic.handleMove(lobbyState, move);
    const response = await ChessService.getLobbyState(lobby.lobby_id);
    if (response == null) return;
    setLobbyState(response);
    setGame(new ChessJS.Chess(response.latest_match_state));
    setWaitingConfirmation(false);
  }

  function onDrop(sourceSquare: ChessJS.Square, targetSquare: ChessJS.Square) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
      handleMove(move.san);
      return true;
    } catch (e) {
      console.log("Illegal move: " + e);
      // illegal move
      return false;
    }
  }

  const handleReplay = async () => {
    setReplayInProgress(true);
    const matchExecutor = await mainController.getMatchExecutor(lobby.lobby_id);
    const localGame = new ChessJS.Chess(matchExecutor.currentState.fenBoard);
    setGame(localGame);
    let events = matchExecutor.tick();
    while (events != null) {
      // chess always has only one relevant event
      const event = events[0];
      // process emitted event (could also just use current state in this instance, this is for demonstration)
      if (isTickEvent(event)) {
        await delay(1000);
        localGame.move(event.pgn_move);
        setGame(new ChessJS.Chess(localGame.fen()));
      }
      events = matchExecutor.tick();
    }
    setReplayInProgress(false);
  };

  const interactionEnabled =
    lobbyState.lobby_state === "active" &&
    !waitingConfirmation &&
    !replayInProgress &&
    chessLogic.isThisPlayersTurn(lobbyState, game);

  return (
    <>
      <Navbar />
      <Container>
        <Paper>
          <h1>Chess Board {lobbyState.lobby_id}</h1>
          {/*  Hide board if there isn't a defined lobbyState */}
          {lobbyState && (
            <div className="game">
              <div className="game-info">
                <div>
                  {chessLogic.gameStateText(lobbyState, waitingConfirmation)}
                </div>
                {waitingConfirmation && (
                  <CircularProgress size={20} sx={{ ml: 2 }} />
                )}
              </div>
              <div className="game-board">
                <Chessboard
                  position={game.fen()}
                  onPieceDrop={onDrop}
                  arePiecesDraggable={interactionEnabled}
                />
              </div>
            </div>
          )}
          {lobbyState.lobby_state === "finished" && (
            <Button onClick={handleReplay}>Replay</Button>
          )}
          <Box paddingTop="20px">
            <Button onClick={() => setShowMore((prev) => !prev)}>
              {showMore ? "Hide" : "Show More Information"}
            </Button>
            {showMore && (
              <Typography>
                {!lobby.lobby_id
                  ? "No current lobby"
                  : JSON.stringify(lobbyState, null, 2)}
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ChessGame;
