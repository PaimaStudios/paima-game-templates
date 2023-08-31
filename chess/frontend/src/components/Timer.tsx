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

export const Timer: React.FC<Props> = ({ value, isRunning, player }) => {
  const [time, setTime] = useState<number>(value);
  const [realTime, setRealTime] = useState<number>(value);

  useEffect(() => {
    setTime(value);
    if (realTime > value) setRealTime(value); 
  }, [value]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(
      () => {
        setTime((time) => {
          let t = (time <= 0) ? 0 : time - 1;
          if (realTime > t) setRealTime(t);
          return t;
        });
      },
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
        {formatTime(realTime)}
      </Typography>
    </Card>
  );
};
