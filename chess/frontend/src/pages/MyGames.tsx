import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import MainController from "@src/MainController";
import { LobbyStatus, UserLobby } from "../paima/types.d";
import Navbar from "@src/components/Navbar";
import SearchBar from "@src/components/SearchBar";
import { AppContext } from "@src/main";
import Wrapper from "@src/components/Wrapper";
import Button from "@src/components/Button";
import { formatDate } from "@src/utils";

type Column = {
  id: keyof UserLobby | "action";
  label: string;
  minWidth: number;
};

const columns: Column[] = [
  { id: "lobby_id", label: "Lobby ID", minWidth: 50 },
  { id: "lobby_state", label: "Status", minWidth: 50 },
  { id: "created_at", label: "Created At", minWidth: 50 },
  { id: "lobby_creator", label: "Host", minWidth: 50 },
  { id: "myTurn", label: "My Turn?", minWidth: 50 },
  { id: "action", label: "", minWidth: 50 },
];

interface MyGamesProps {
  myAddress: string;
}

const actionMap: Record<LobbyStatus, string> = {
  active: "Enter",
  finished: "Enter",
  open: "Close",
  closed: "",
};

const MyGames: React.FC<MyGamesProps> = ({ myAddress }) => {
  const mainController: MainController = useContext(AppContext);

  const [lobbies, setLobbies] = useState<UserLobby[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    mainController.getMyGames().then((lobbies) => {
      setLobbies(lobbies);
    });
  }, []);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLobbiesRefresh = async () => {
    const lobbies = await mainController.getMyGames();

    setPage(0);
    setSearchText("");
    setLobbies(lobbies);
  };

  const filteredLobbies = lobbies.filter((lobby) => {
    const rowValues = Object.values(lobby).join("");
    if (rowValues == null) return false;
    return rowValues.toLowerCase().includes(searchText.toLowerCase());
  });

  const expandValue = (id: keyof UserLobby, value: unknown) => {
    if (id === "lobby_creator" && typeof value === "string") {
      return value.toLowerCase() === myAddress.toLowerCase() ? "Yes" : "No";
    }
    if (id === "created_at" && typeof value === "string") {
      return formatDate(value);
    }
    if (id === "myTurn") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "string") {
      return value;
    }
    return null;
  };

  const handleLobbyAction = (status: LobbyStatus, lobbyId: string) => {
    if (status === "open") {
      mainController.closeLobby(lobbyId);
    } else {
      mainController.moveToJoinedLobby(lobbyId);
    }
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
                              <Button
                                disabled={lobby.lobby_state === "closed"}
                                onClick={() =>
                                  handleLobbyAction(
                                    lobby.lobby_state,
                                    lobby.lobby_id
                                  )
                                }
                              >
                                {actionMap[lobby.lobby_state]}
                              </Button>
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
