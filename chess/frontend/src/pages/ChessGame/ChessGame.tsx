import React, { useContext, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import type { LobbyState } from "../../paima/types";
import { ChessLogic, ChessService } from "./GameLogic";

import { Chessboard } from "react-chessboard";
import * as ChessJS from "chess.js";
import type MainController from "@src/MainController";
import { AppContext } from "@src/main";
import Layout from "@src/layouts/Layout";
import { delay, isTickEvent } from "@src/utils";
import Card from "@src/components/Card";
import { useSearchParams } from "react-router-dom";
import { Timer } from "@src/components/Timer";
import { chessPieces } from "./pieces";

interface Props {
  lobby: LobbyState | null;
}

const ChessGame: React.FC<Props> = ({ lobby }) => {
  const [params] = useSearchParams();
  const lobbyID = params.get("lobby") || "";

  const mainController: MainController = useContext(AppContext);
  const chessLogic = new ChessLogic(mainController.userAddress);

  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const [replayInProgress, setReplayInProgress] = useState(false);
  const [game, setGame] = useState(new ChessJS.Chess());
  const [lobbyState, setLobbyState] = useState<LobbyState>(lobby);

  useEffect(() => {
    const fetchLobby = async () => {
      const lobbyState = await ChessService.getLobbyState(lobbyID);
      if (lobbyState == null) return;
      setLobbyState(lobbyState);
      setGame(new ChessJS.Chess(lobbyState.latest_match_state));
    };

    if (!lobby) {
      fetchLobby();
    } else {
      setGame(new ChessJS.Chess(lobby.latest_match_state));
    }
  }, [lobby, lobbyID]);

  useEffect(() => {
    const fetchLobbyData = async () => {
      if (waitingConfirmation || replayInProgress) return;
      const lobbyState = await ChessService.getLobbyState(lobbyID);
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
  }, [waitingConfirmation, replayInProgress, lobbyID]);

  async function handleMove(move: string): Promise<void> {
    setWaitingConfirmation(true);
    await chessLogic.handleMove(lobbyState, move);
    const response = await ChessService.getLobbyState(lobbyID);
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
    const matchExecutor = await mainController.getMatchExecutor(lobbyID);
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

  // TODO: graceful loader
  if (!lobbyState) return null;

  const interactionEnabled =
    lobbyState.lobby_state === "active" &&
    !waitingConfirmation &&
    !replayInProgress &&
    chessLogic.isThisPlayersTurn(lobbyState, game);

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "24px" }}>
        <Box sx={{ alignSelf: "flex-end" }}>
          <Timer
            value={25 * 60}
            isRunning={
              interactionEnabled &&
              chessLogic.thisPlayerColor(lobbyState) === "w"
            }
            player={lobbyState.player_two}
          />
        </Box>
        <Card layout>
          <Box>
            <Typography variant="h2">
              Chess Board {lobbyState.lobby_id}
            </Typography>
            <Typography>
              {chessLogic.gameStateText(lobbyState, waitingConfirmation)}
              {waitingConfirmation && (
                <CircularProgress size={20} sx={{ ml: 2 }} />
              )}
            </Typography>
          </Box>
          <Box sx={{ width: "450px", height: "450px" }}>
            <Chessboard
              customLightSquareStyle={{ backgroundColor: "#D8E9EB" }}
              customDarkSquareStyle={{ backgroundColor: "#907B90" }}
              customPieces={chessPieces}
              position={game.fen()}
              onPieceDrop={onDrop}
              arePiecesDraggable={interactionEnabled}
            />
          </Box>
          {lobbyState.lobby_state === "finished" && (
            <Button onClick={handleReplay} fullWidth>
              Replay
            </Button>
          )}
        </Card>
        <Box sx={{ alignSelf: "flex-start" }}>
          <Timer
            value={24 * 60 * 60}
            isRunning={
              interactionEnabled &&
              chessLogic.thisPlayerColor(lobbyState) === "b"
            }
            player={lobbyState.lobby_creator}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default ChessGame;
