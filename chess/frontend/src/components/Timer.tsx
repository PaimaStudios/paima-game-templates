import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Card from "./Card";
import { formatPlayer, formatTime } from "@src/utils";

interface Props {
  // TODO: readable name from MW
  player: string;
  // remaining time in seconds
  value: number;
  isRunning: boolean;
}

// TODO: update value during replay?

export const Timer: React.FC<Props> = ({ value, isRunning, player }) => {
  const [time, setTime] = useState<number>(value);

  useEffect(() => {
    setTime(value);
  }, [value]);

  // TODO: in blocks?
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(
      () =>
        setTime((time) => {
          if (time <= 0) return 0;
          return time - 1;
        }),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [value, isRunning]);

  return (
    <Card layout>
      <Typography variant="h2">{formatPlayer(player)}</Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "2rem",
          fontFamily: "monospace",
        }}
      >
        {formatTime(time)}
      </Typography>
    </Card>
  );
};
