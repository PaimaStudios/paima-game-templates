import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import type { LobbyStatus } from "@cards/game-logic";
import Navbar from "@src/components/Navbar";
import SearchBar from "@src/components/SearchBar";
import Wrapper from "@src/components/Wrapper";
import Button from "@src/components/Button";
import { formatDate } from "@src/utils";
import { useGlobalStateContext } from "@src/GlobalStateContext";
import type {
  IGetLobbyByIdResult,
  IGetPaginatedUserLobbiesResult,
} from "@cards/db";
import { useNavigate } from "react-router-dom";
import { Page } from "@src/pages/PageCoordinator";
import { closeLobby, getMyGames } from "@src/services/utils";

type Column = {
  id: keyof IGetPaginatedUserLobbiesResult | "action";
  label: string;
  minWidth: number;
};

const columns: Column[] = [
  { id: "lobby_id", label: "Lobby ID", minWidth: 50 },
  { id: "lobby_state", label: "Status", minWidth: 50 },
  { id: "created_at", label: "Created At", minWidth: 50 },
  { id: "lobby_creator", label: "Host", minWidth: 50 },
  { id: "action", label: "", minWidth: 50 },
];

const actionMap: Record<LobbyStatus, string[]> = {
  active: ["Enter"],
  finished: ["Enter"],
  open: ["Enter", "Close"],
  closed: [],
};

const ActionButton: React.FC<{ lobby: IGetPaginatedUserLobbiesResult }> = (
  props
) => {
  const navigate = useNavigate();
  const {
    selectedNftState: [selectedNft],
    joinedLobbyRawState: [, setJoinedLobbyRaw],
  } = useGlobalStateContext();

  const handleLobbyAction = async (
    action: string,
    lobby: IGetLobbyByIdResult
  ) => {
    if (selectedNft.nft == null) return;

    if (action === "Close") {
      await closeLobby(selectedNft.nft, lobby.lobby_id);
    } else if (action === "Enter") {
      setJoinedLobbyRaw(lobby);
      navigate(Page.Game);
    }
  };

  const actions = actionMap[props.lobby.lobby_state];
  if (actions == null || actions.length === 0) {
    return <></>;
  }
  return (
    <Box sx={{ display: "flex" }}>
      {actions.map((action, i) => (
        <>
          {i > 0 && <Box sx={{ marginLeft: "8px" }} />}
          <Button
            key={action}
            disabled={props.lobby.lobby_state === "closed"}
            onClick={() => handleLobbyAction(action, props.lobby)}
          >
            {action}
          </Button>
        </>
      ))}
    </Box>
  );
};

const MyGames: React.FC = () => {
  const {
    selectedNftState: [selectedNft],
  } = useGlobalStateContext();

  const [lobbies, setLobbies] = useState<IGetPaginatedUserLobbiesResult[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (selectedNft.nft == null) return;

    getMyGames(selectedNft.nft).then((lobbies) => {
      setLobbies(lobbies);
    });
  }, [selectedNft]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLobbiesRefresh = async () => {
    if (selectedNft.nft == null) return;

    const lobbies = await getMyGames(selectedNft.nft);

    setPage(0);
    setSearchText("");
    setLobbies(lobbies);
  };

  const filteredLobbies = lobbies.filter((lobby) => {
    const rowValues = Object.values(lobby).join("");
    if (rowValues == null) return false;
    return rowValues.toLowerCase().includes(searchText.toLowerCase());
  });

  const expandValue = (
    id: keyof IGetPaginatedUserLobbiesResult,
    value: unknown
  ) => {
    if (id === "lobby_creator" && typeof value === "number") {
      return value === selectedNft.nft ? "Yes" : "No";
    }
    if (id === "created_at" && typeof value === "string") {
      return formatDate(value);
    }
    if (typeof value === "string") {
      return value;
    }
    return null;
  };

  return (
    <>
      <Navbar>
        <SearchBar
          value={searchText}
          onRefresh={handleLobbiesRefresh}
          onSearch={setSearchText}
        />
      </Navbar>
      <Wrapper>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    sx={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLobbies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lobby) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={lobby.lobby_id}
                    >
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align="left">
                            {column.id === "action" ? (
                              <ActionButton lobby={lobby} />
                            ) : (
                              expandValue(column.id, lobby[column.id])
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLobbies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Wrapper>
    </>
  );
};

export default MyGames;
