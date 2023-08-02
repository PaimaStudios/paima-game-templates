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

export const chessPieces: Record<string, (height: number) => React.ReactNode> =
  {
    wP: (height: number) => <img src={whitePawn} height={height} />,
    wR: (height: number) => <img src={whiteRook} height={height} />,
    wN: (height: number) => <img src={whiteKnight} height={height} />,
    wB: (height: number) => <img src={whiteBishop} height={height} />,
    wQ: (height: number) => <img src={whiteQueen} height={height} />,
    wK: (height: number) => <img src={whiteKing} height={height} />,

    bP: (height: number) => <img src={blackPawn} height={height} />,
    bR: (height: number) => <img src={blackRook} height={height} />,
    bN: (height: number) => <img src={blackKnight} height={height} />,
    bB: (height: number) => <img src={blackBishop} height={height} />,
    bQ: (height: number) => <img src={blackQueen} height={height} />,
    bK: (height: number) => <img src={blackKing} height={height} />,
  };

export enum ChessPiece {
  PAWN = "p",
  ROOK = "r",
  KNIGHT = "n",
  BISHOP = "b",
  QUEEN = "q",
  KING = "k",
}
