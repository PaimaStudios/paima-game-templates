import React from "react";
import { useTheme } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { chessPieces } from "./pieces";
import { Chess, type Square } from "chess.js";

interface Props {
  board: string;
  playerColor: "white" | "black",
  arePiecesDraggable: boolean;
  handleMove: (move: string) => void;
  promotion: string;
}

let highlightedSquares: HTMLElement[] = [];

// 20% darker than palette.secondary used for squares
const whiteHighlight = "#ADBABC";
const blackHighlight = "#736273";

const MAX_BOARD_WIDTH = 450;
const PADDING = 64; // 2x "32px" which is the padding from Card.tsx

const ChessBoard: React.FC<Props> = ({
  board,
  playerColor,
  arePiecesDraggable,
  handleMove,
  promotion,
}) => {
  const palette = useTheme().palette.secondary;
  const game = new Chess(board);
  const [boardWidth, setBoardWidth] = React.useState<number>(MAX_BOARD_WIDTH);
  React.useEffect(() => {
    const handleResize = () => {
      setBoardWidth(Math.min(MAX_BOARD_WIDTH, window.innerWidth - PADDING));
    }

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

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
    <Chessboard
      customLightSquareStyle={{ backgroundColor: palette.light }}
      customDarkSquareStyle={{ backgroundColor: palette.dark }}
      onMouseOverSquare={onMouseoverSquare}
      onMouseOutSquare={removeHighlightedSquares}
      customPieces={chessPieces}
      position={board}
      onPieceDrop={onDrop}
      arePiecesDraggable={arePiecesDraggable}
      boardWidth={boardWidth}
      boardOrientation={playerColor}
    />
  );
};

export default ChessBoard;
