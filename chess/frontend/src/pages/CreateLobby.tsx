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

const CreateLobby: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [numberOfRounds, setNumberOfRounds] = useState("10");
  const [roundLength, setRoundLength] = useState("100");
  const [playersTime, setPlayersTime] = useState("100");
  const [isHidden, setIsHidden] = useState(false);
  const [isPractice, setIsPractice] = useState(false);

  const handleCreateLobby = async () => {
    const numberOfRoundsNum = parseInt(numberOfRounds);
    const roundLengthNum = parseInt(roundLength);
    const playersTimeNum = parseInt(playersTime);

    await mainController.createLobby(
      numberOfRoundsNum,
      roundLengthNum,
      playersTimeNum,
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
            <NumericField
              label="Number of Rounds"
              value={numberOfRounds}
              onChange={setNumberOfRounds}
            />
            <NumericField
              label="Player's Time"
              value={playersTime}
              onChange={setPlayersTime}
            />
            <NumericField
              label="Round Length"
              value={roundLength}
              onChange={setRoundLength}
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
