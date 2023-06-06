import React, { useContext, useState } from "react";
import "./CreateLobby.scss";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import MainController from "@src/MainController";
import Navbar from "@src/components/Navbar";
import { AppContext } from "@src/main";
import Wrapper from "@src/components/Wrapper";
import Button from "@src/components/Button";
import NumericField from "@src/components/NumericField";

const CreateLobby: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [numberOfRounds, setNumberOfRounds] = useState("10");
  const [roundLength, setRoundLength] = useState("100");
  const [playersTime, setPlayersTime] = useState("100");
  const [isHidden, setIsHidden] = useState(false);

  const handleCreateLobby = async () => {
    const numberOfRoundsNum = parseInt(numberOfRounds);
    const roundLengthNum = parseInt(roundLength);
    const playersTimeNum = parseInt(playersTime);

    await mainController.createLobby(
      numberOfRoundsNum,
      roundLengthNum,
      playersTimeNum,
      isHidden,
      false
    );
  };

  return (
    <>
      <Navbar />
      <Wrapper small>
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
                  checked={isHidden}
                  onChange={(event) => setIsHidden(event.target.checked)}
                />
              }
              label="Is Hidden?"
            />
          </Box>
        </Box>

        <Button onClick={handleCreateLobby}>Create</Button>
      </Wrapper>
    </>
  );
};

export default CreateLobby;
