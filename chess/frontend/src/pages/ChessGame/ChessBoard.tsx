import React from "react";
import { Box, useTheme } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { chessPieces } from "./pieces";
import { Chess, type Square } from "chess.js";

interface Props {
  board: string;
  arePiecesDraggable: boolean;
  handleMove: (move: string) => void;
  promotion: string;
}

let highlightedSquares: HTMLElement[] = [];

// 20% darker than palette.secondary used for squares
const whiteHighlight = "#ADBABC";
const blackHighlight = "#736273";

const ChessBoard: React.FC<Props> = ({
  board,
  arePiecesDraggable,
  handleMove,
  promotion,
}) => {
  const palette = useTheme().palette.secondary;
  const game = new Chess(board);

  const onMouseoverSquare = (square: Square) => {
    if (!arePiecesDraggable) return;

    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) return;

    highlightSquare(square);
    moves.forEach((move) => {
      highlightSquare(move.to);
    });
  };

  const removeHighlightedSquares = () => {
    highlightedSquares.forEach((square) => {
      if (square.dataset.squareColor === "black") {
        square.style.backgroundColor = palette.dark;
      } else {
        square.style.backgroundColor = palette.light;
      }
    });
    highlightedSquares = [];
  };

  const highlightSquare = (square: Square) => {
    const element = document.querySelector(
      `[data-square=${square}]`
    ) as HTMLElement;

    const isBlack = element.dataset.squareColor === "black";
    element.style.backgroundColor = isBlack ? blackHighlight : whiteHighlight;
    highlightedSquares.push(element);
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion,
      });
      handleMove(move.san);
      return true;
    } catch (e) {
      console.log("Illegal move: " + e);
      // illegal move
      return false;
    }
  };

  return (
    <Box sx={{ width: "450px", height: "450px" }}>
      <Chessboard
        customLightSquareStyle={{ backgroundColor: palette.light }}
        customDarkSquareStyle={{ backgroundColor: palette.dark }}
        onMouseOverSquare={onMouseoverSquare}
        onMouseOutSquare={removeHighlightedSquares}
        customPieces={chessPieces}
        position={board}
        onPieceDrop={onDrop}
        arePiecesDraggable={arePiecesDraggable}
      />
    </Box>
  );
};

export default ChessBoard;
