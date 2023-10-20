import React from "react";
import { Box, Typography } from "@mui/material";
import Card, { cardHeight, cardWidth } from "./Card";

export default function Deck({ size }: { size: number }): React.ReactElement {
  const visualCards = Math.min(size, 3);

  return (
    <Box
      sx={{
        flex: "none",
        minHeight: cardHeight,
        width: cardWidth,
        position: "relative",
      }}
    >
      {Array(visualCards)
        .fill(null)
        .map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: `${i * 8}px`,
              left: `${i * 8}px`,
            }}
          >
            <Card cardRegistryId={undefined} />
            {i === visualCards - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2rem",
                    lineHeight: "2.5rem",
                  }}
                >
                  {size}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      {visualCards === 0 && (
        <Box
          sx={{
            width: cardWidth,
            height: cardHeight,
            background: "none",
            borderRadius: "8px",
            border: "2px dashed #222",
          }}
        />
      )}
    </Box>
  );
}
