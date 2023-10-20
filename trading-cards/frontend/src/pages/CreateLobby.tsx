import React, { useState } from "react";
import "./CreateLobby.scss";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import Navbar from "@src/components/Navbar";
import Wrapper from "@src/components/Wrapper";
import Button from "@src/components/Button";
import NumericField from "@src/components/NumericField";
import { useGlobalStateContext } from "@src/GlobalStateContext";
import { useNavigate } from "react-router-dom";
import { Page } from "@src/pages/PageCoordinator";
import { createLobby } from "@src/services/utils";

const CreateLobby: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedNftState: [selectedNft],
    selectedDeckState: [selectedDeck],
    collection,
    joinedLobbyRawState: [, setJoinedLobbyRaw],
  } = useGlobalStateContext();

  const [numberOfRounds, setNumberOfRounds] = useState("5");
  const [turnLength, setTurnLength] = useState("100");
  const [isHidden, setIsHidden] = useState(false);
  const [isPractice, setIsPractice] = useState(false);

  const handleCreateLobby = async () => {
    if (
      collection.cards == null ||
      selectedNft.nft == null ||
      selectedDeck == null
    )
      return;

    const numberOfRoundsNum = parseInt(numberOfRounds);
    const turnLengthNum = parseInt(turnLength);

    const createdLobby = await createLobby(
      selectedNft.nft,
      selectedDeck.map((card) => {
        if (collection.cards?.[card] == null)
          throw new Error(`createLobby: card not found in collection`);
        return {
          id: card,
          registryId: collection.cards[card].registry_id,
        };
      }),
      numberOfRoundsNum,
      turnLengthNum,
      isHidden,
      isPractice
    );
    setJoinedLobbyRaw(createdLobby);
    navigate(Page.Game);
  };

  return (
    <>
      <Navbar />
      <Wrapper small>
        <Box>
          {
            <Box sx={{ display: "flex", flexFlow: "column", gap: "2rem" }}>
              <NumericField
                label="Number of Rounds"
                value={numberOfRounds}
                onChange={setNumberOfRounds}
              />
              {
                // TODO: disabled - time limit (zombie round) needs to be properly implemented on the backend
                /* <NumericField
                label="Player's Time"
                value={turnLength}
                onChange={setTurnLength}
              /> */
              }
            </Box>
          }
          <Box sx={{ display: "flex", paddingTop: "24px" }}>
            {
              // TODO: disabled - needs to be checked and fixed
              /* <FormControlLabel
              sx={{ flex: "1" }}
              control={
                <Checkbox
                  checked={isHidden}
                  onChange={(event) => setIsHidden(event.target.checked)}
                />
              }
              label="Is Hidden?"
            /> */
            }
            <FormControlLabel
              sx={{ flex: "1" }}
              control={
                <Checkbox
                  checked={isPractice}
                  onChange={(event) => setIsPractice(event.target.checked)}
                />
              }
              label="Single-Player vs. Bots"
            />
          </Box>
        </Box>

        <Button onClick={handleCreateLobby}>Create</Button>
      </Wrapper>
    </>
  );
};

export default CreateLobby;
