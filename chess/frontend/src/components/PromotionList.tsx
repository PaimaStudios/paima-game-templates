import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { ChessPiece, chessPieces } from "@src/pages/ChessGame/pieces";

interface Props {
  onValueChange: (piece: string) => void;
  value: string;
  color: "w" | "b";
}

const promotionOptions = [
  ChessPiece.KNIGHT,
  ChessPiece.BISHOP,
  ChessPiece.ROOK,
  ChessPiece.QUEEN,
];

const PromotionList: React.FC<Props> = ({ onValueChange, color, value }) => {
  return (
    <Box>
      <Tooltip title="Pawn promotion preference">
        <ToggleButtonGroup
          color="primary"
          value={value}
          exclusive
          onChange={(_event, newValue) => onValueChange(newValue)}
          aria-label="pawn promotion"
        >
          {promotionOptions.map((piece) => (
            <ToggleButton key={piece} value={piece}>
              {chessPieces[`${color}${piece.toUpperCase()}`]({ squareWidth: 32, isDragging: false })}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Tooltip>
    </Box>
  );
};

export default PromotionList;
