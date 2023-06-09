import React from "react";

import whitePawn from "@assets/images/pieces/whitePawn.svg";
import whiteRook from "@assets/images/pieces/whiteRook.svg";
import whiteKnight from "@assets/images/pieces/whiteKnight.svg";
import whiteBishop from "@assets/images/pieces/whiteBishop.svg";
import whiteQueen from "@assets/images/pieces/whiteQueen.svg";
import whiteKing from "@assets/images/pieces/whiteKing.svg";

import blackPawn from "@assets/images/pieces/blackPawn.svg";
import blackRook from "@assets/images/pieces/blackRook.svg";
import blackKnight from "@assets/images/pieces/blackKnight.svg";
import blackBishop from "@assets/images/pieces/blackBishop.svg";
import blackQueen from "@assets/images/pieces/blackQueen.svg";
import blackKing from "@assets/images/pieces/blackKing.svg";

// Inspired by https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

export const chessPieces: Record<string, () => React.ReactNode> = {
  wP: () => <img src={whitePawn} />,
  wR: () => <img src={whiteRook} />,
  wN: () => <img src={whiteKnight} />,
  wB: () => <img src={whiteBishop} />,
  wQ: () => <img src={whiteQueen} />,
  wK: () => <img src={whiteKing} />,

  bP: () => <img src={blackPawn} />,
  bR: () => <img src={blackRook} />,
  bN: () => <img src={blackKnight} />,
  bB: () => <img src={blackBishop} />,
  bQ: () => <img src={blackQueen} />,
  bK: () => <img src={blackKing} />,
};
