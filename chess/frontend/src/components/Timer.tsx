import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Card from "./Card";
import { formatTime } from "@src/utils";

interface Props {
  // TODO: readable name from MW
  player: string;
  value: number;
  isRunning: boolean;
}

// TODO: update value during replay?

export const Timer: React.FC<Props> = ({ value, isRunning, player }) => {
  const [time, setTime] = useState<number>(value);

  useEffect(() => {
    setTime(value);
  }, [value]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => setTime((time) => (time -= 1)), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [value, isRunning]);

  return (
    <Card layout sx={{ maxWidth: "150px", overflow: "hidden" }}>
      <Typography variant="h2">{player}</Typography>
      <Typography>{formatTime(time)}</Typography>
    </Card>
  );
};
