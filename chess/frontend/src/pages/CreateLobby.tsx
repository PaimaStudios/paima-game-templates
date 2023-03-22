import React, { useContext, useState } from "react";
import "./CreateLobby.scss";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import MainController from "@src/MainController";
import Navbar from "@src/components/Navbar";
import { AppContext } from "@src/main";

const CreateLobby: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [numberOfRounds, setNumberOfRounds] = useState("10");
  const [roundLength, setRoundLength] = useState("100");
  const [playersTime, setPlayersTime] = useState("100");
  const [isHidden, setIsHidden] = useState(false);
  const [isPractice, setIsPractice] = useState(false);
  const [createLobbyMessage, setCreateLobbyMessage] = useState("");

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
    setCreateLobbyMessage("Lobby Created Successfully");
  };

  return (
    <>
      <Navbar />
      <Container>
        <Paper className="create-lobby">
          <List>
            <div className="input-wrapper">
              <TextField
                label="Number of Rounds"
                type="number"
                value={numberOfRounds}
                onChange={(event) => setNumberOfRounds(event.target.value)}
              />
              <TextField
                label="Player's Time"
                type="number"
                value={playersTime}
                onChange={(event) => setPlayersTime(event.target.value)}
              />
              <TextField
                label="Round Length"
                type="number"
                value={roundLength}
                onChange={(event) => setRoundLength(event.target.value)}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPractice}
                    onChange={(event) => setIsPractice(event.target.checked)}
                  />
                }
                label="Is Practice?"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isHidden}
                    onChange={(event) => setIsHidden(event.target.checked)}
                  />
                }
                label="Is Hidden?"
              />
            </div>

            <Button variant="contained" onClick={handleCreateLobby}>
              Create
            </Button>
            <Typography>{createLobbyMessage}</Typography>
          </List>
        </Paper>
      </Container>
    </>
  );
};

export default CreateLobby;
