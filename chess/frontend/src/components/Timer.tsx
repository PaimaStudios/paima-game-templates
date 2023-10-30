import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Card from "./Card";
import { formatPlayer, formatTime } from "@src/utils";
import { BLOCK_TIME } from "@src/utils/constants";

interface Props {
  // TODO: readable name from MW
  player: string;
  // remaining time in seconds according to the chain
  blockchainTime: number;
  isRunning: boolean;
}

function largeDiff(realTime: number, value: number): boolean {
  return Math.abs(realTime - value) >= BLOCK_TIME * 2;
}

export const Timer: React.FC<Props> = ({ blockchainTime, isRunning, player }) => {
  const [realTime, setRealTime] = useState<number>(blockchainTime);

  useEffect(() => {
    if (largeDiff(realTime, blockchainTime)) setRealTime(blockchainTime); 
  }, [blockchainTime,]);

  useEffect(() => {
    setRealTime(blockchainTime); 
  }, [player,]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(
      () => {
        setRealTime((time) => time <= 0 ? 0 : time - 1);
      },
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [isRunning,]);

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
