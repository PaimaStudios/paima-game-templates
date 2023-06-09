import React, { useState, useMemo } from "react";
import type { LobbyStatus, UserLobby } from "../paima/types";
import { formatDate } from "@src/utils";
import LobbyCard from "@src/components/LobbyCard";
import LobbyToolbar from "@src/components/LobbyToolbar";
import { Box, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  title: string;
  lobbies: UserLobby[];
  actionMap: Partial<Record<LobbyStatus, string>>;
  onLobbySelect: (lobby: UserLobby) => void;
  onLobbySearch?: (query: string) => void;
}

const LobbyList: React.FC<Props> = ({
  title,
  lobbies,
  actionMap,
  onLobbySelect,
  onLobbySearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const filteredLobbies = useMemo(() => {
    if (searchQuery) {
      return lobbies.filter((lobby) => {
        // TODO: lobby ID will be enough
        const rowValues = Object.values(lobby).join("");
        if (rowValues == null) return false;
        return rowValues.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    return lobbies;
  }, [searchQuery, lobbies]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    onLobbySearch?.(query);
  };

  // TODO based on resolution
  const lobbiesPerPage = 4;
  const totalPages = Math.ceil(filteredLobbies.length / lobbiesPerPage);

  return (
    <>
      <LobbyToolbar
        onSearch={handleSearch}
        value={searchQuery}
        title={title}
        lobbyCount={filteredLobbies.length}
        currentPage={page}
        totalPages={totalPages}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ flex: 2 }}>
          {page > 0 && (
            <IconButton
              onClick={() => setPage((page) => (page -= 1))}
              color="inherit"
              aria-label="previous"
            >
              <ArrowBackIosIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "24px",
            pt: "24px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {filteredLobbies
            .slice(
              page * lobbiesPerPage,
              page * lobbiesPerPage + lobbiesPerPage
            )
            .map((lobby) => {
              return (
                <LobbyCard
                  key={lobby.lobby_id}
                  // TODO: improve design, this is always white. or add color to lobby creation
                  host="White"
                  lobbyId={lobby.lobby_id}
                  createdAt={formatDate(lobby.created_at)}
                  myTurn={lobby.myTurn}
                  ctaButton={
                    <Button
                      disabled={lobby.lobby_state === "closed"}
                      fullWidth
                      onClick={() => onLobbySelect(lobby)}
                    >
                      {actionMap[lobby.lobby_state]}
                    </Button>
                  }
                />
              );
            })}
        </Box>
        <Box sx={{ flex: 2 }}>
          {page + 1 < totalPages && (
            <IconButton
              onClick={() => setPage((page) => (page += 1))}
              aria-label="next"
              color="inherit"
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default LobbyList;
