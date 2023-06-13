import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import type MainController from "@src/MainController";
import { AppContext } from "@src/main";
import Layout from "@src/layouts/Layout";
import NumericField from "@src/components/NumericField";
import Card from "@src/components/Card";
import { BLOCK_TIME } from "@src/utils/constants";
import { blocksToTime } from "@src/utils";
import SelectField from "@src/components/SelectField";

// 10m, 15m, 30m, 1h, 24h
const gameLengths = [
  (10 * 60) / BLOCK_TIME,
  (15 * 60) / BLOCK_TIME,
  (30 * 60) / BLOCK_TIME,
  (60 * 60) / BLOCK_TIME,
  (24 * 60 * 60) / BLOCK_TIME,
];

const CreateLobby: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [numberOfRounds, setNumberOfRounds] = useState("40");
  const [roundLength, setRoundLength] = useState("100");
  const [playersTime, setPlayersTime] = useState(gameLengths[0]);
  const [isHidden, setIsHidden] = useState(false);
  const [isPractice, setIsPractice] = useState(false);

  const handleCreateLobby = async () => {
    const numberOfRoundsNum = parseInt(numberOfRounds);
    const roundLengthNum = parseInt(roundLength);

    await mainController.createLobby(
      numberOfRoundsNum,
      roundLengthNum,
      playersTime,
      isHidden,
      isPractice
    );
  };

  return (
    <Layout small>
      <Card layout blurred>
        <Typography variant="h2">Create</Typography>
        <Box>
          <Box sx={{ display: "flex", flexFlow: "column", gap: "2rem" }}>
            <SelectField
              label="Player's Time"
              items={gameLengths}
              value={playersTime}
              onChange={(event) => setPlayersTime(event.target.value as number)}
              displayTransform={blocksToTime}
            />
            <NumericField
              label="Round Length (in blocks)"
              value={roundLength}
              onChange={setRoundLength}
            />
            <NumericField
              label="Number of Rounds"
              value={numberOfRounds}
              onChange={setNumberOfRounds}
            />
          </Box>
          <Box sx={{ display: "flex", paddingTop: "24px" }}>
            <FormControlLabel
              sx={{ flex: "1" }}
              control={
                <Checkbox
                  checked={isPractice}
                  onChange={(event) => setIsPractice(event.target.checked)}
                />
              }
              label="Is Practice?"
            />
            <FormControlLabel
              sx={{ flex: "1" }}
              control={
                <Checkbox
                  checked={isHidden}
                  onChange={(event) => setIsHidden(event.target.checked)}
                />
              }
              label="Is Hidden?"
            />
          </Box>
        </Box>
        <Button onClick={handleCreateLobby}>Create</Button>
      </Card>
    </Layout>
  );
};

export default CreateLobby;
