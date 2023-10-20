import type {
  IGetLobbyByIdResult,
  IGetPaginatedUserLobbiesResult,
} from "@cards/db";
import type {
  LobbyState,
  CardDbId,
  CardRegistryId,
  LocalCard,
  MatchState,
  TickEvent,
} from "@cards/game-logic";
import { DECK_LENGTH, genCommitments } from "@cards/game-logic";
import * as Paima from "@cards/middleware";
import LocalStorage from "@src/LocalStorage";
import type { MatchExecutor } from "@paima/sdk/executors";

export type Characters = typeof characters[number];
export const characters = ["null"] as const;

export const characterToNumberMap: Record<Characters, number> = {
  null: 0,
};

export async function fetchNft(address: string): Promise<undefined | number> {
  const response = await Paima.default.getNftForWallet(address);
  console.log("fetch nfts response: ", response);
  if (!response.success) return;
  return response.result.nft;
}

export async function loadLobbyState(lobbyId: string): Promise<LobbyState> {
  const response = await Paima.default.getLobbyState(lobbyId);
  console.log("get lobby state response: ", response);
  if (!response.success || response.result.lobby == null) {
    throw new Error("Could not get lobby state");
  }
  return response.result.lobby;
}

export async function loadLobbyRaw(
  lobbyId: string
): Promise<IGetLobbyByIdResult> {
  const response = await Paima.default.getLobbyRaw(lobbyId);
  console.log("get lobby state response: ", response);
  if (!response.success || response.result.lobby == null) {
    throw new Error("Could not get lobby state");
  }
  return response.result.lobby;
}

export async function searchLobby(
  nftId: number,
  query: string,
  page: number
): Promise<IGetLobbyByIdResult[]> {
  const response = await Paima.default.getLobbySearch(nftId, query, page, 1);
  console.log("search lobby response: ", response);
  if (!response.success) {
    throw new Error("Could not search lobby");
  }
  return response.result.lobbies;
}

export async function createLobby(
  creatorNftId: number,
  creatorDeck: { id: CardDbId; registryId: CardRegistryId }[],
  numOfRounds: number,
  timePerPlayer: number,
  isHidden = false,
  isPractice = false
): Promise<IGetLobbyByIdResult> {
  console.log(
    "create lobby: ",
    creatorNftId,
    creatorDeck,
    numOfRounds,
    timePerPlayer,
    isHidden,
    isPractice
  );

  if (creatorDeck?.length !== DECK_LENGTH) {
    // shouldn't happen
    throw new Error(`createLobby: invalid deck`);
  }

  const commitments = await genCommitments(
    window.crypto,
    creatorDeck.map((card) => card.id)
  );
  const localDeck: LocalCard[] = creatorDeck.map((card, i) => ({
    id: card.id,
    registryId: card.registryId,
    salt: commitments.salt[i],
  }));

  const response = await Paima.default.createLobby(
    creatorNftId,
    commitments.commitments,
    numOfRounds,
    timePerPlayer,
    isHidden,
    isPractice
  );
  console.log("create lobby response: ", response);
  if (!response.success) {
    throw new Error("Could not create lobby");
  }
  const lobbyRaw = await loadLobbyRaw(response.lobbyID);
  LocalStorage.setLobbyDeck(response.lobbyID, localDeck);
  return lobbyRaw;
}

export async function joinLobby(
  nftId: number,
  deck: { id: CardDbId; registryId: CardRegistryId }[],
  lobbyId: string
): Promise<IGetLobbyByIdResult> {
  if (deck?.length !== DECK_LENGTH) {
    // shouldn't happen
    throw new Error(`joinLobby: invalid deck`);
  }

  const commitments = await genCommitments(
    window.crypto,
    deck.map((card) => card.id)
  );
  const localDeck: LocalCard[] = deck.map((card, i) => ({
    id: card.id,
    registryId: card.registryId,
    salt: commitments.salt[i],
  }));

  const response = await Paima.default.joinLobby(
    nftId,
    lobbyId,
    commitments.commitments
  );
  if (!response.success) {
    throw new Error("Could not join lobby");
  }
  const resp = await Paima.default.getLobbyRaw(lobbyId);
  console.log("move to joined lobby response: ", response);
  if (!resp.success || resp.result.lobby == null) {
    throw new Error("Could not download lobby state from join lobby");
  }
  LocalStorage.setLobbyDeck(resp.result.lobby.lobby_id, localDeck);
  return resp.result.lobby;
}

export async function closeLobby(
  nftId: number,
  lobbyId: string
): Promise<void> {
  const response = await Paima.default.closeLobby(nftId, lobbyId);
  console.log("close lobby response: ", response);
  if (!response.success) {
    throw new Error("Could not close lobby");
  }
}

export async function getOpenLobbies(
  nftId: number,
  page = 0,
  limit = 100
): Promise<IGetLobbyByIdResult[]> {
  const response = await Paima.default.getOpenLobbies(nftId, page, limit);
  console.log("get open lobbies response: ", response);
  if (!response.success) {
    throw new Error("Could not get open lobbies");
  }
  return response.result.lobbies;
}

export async function getMyGames(
  nftId: number,
  page = 0,
  limit = 100
): Promise<IGetPaginatedUserLobbiesResult[]> {
  const response = await Paima.default.getUserLobbiesMatches(
    nftId,
    page,
    limit
  );
  console.log("get my games response: ", response);
  if (!response.success) {
    throw new Error("Could not get open lobbies");
  }
  return response.result.lobbies;
}

export async function getMatchExecutor(
  lobbyId: string,
  matchWithinLobby: number
): Promise<MatchExecutor<MatchState, TickEvent>> {
  const response = await Paima.default.getMatchExecutor(
    lobbyId,
    matchWithinLobby
  );
  console.log("get match executor: ", response);
  if (!response.success) {
    throw new Error("Could not get match executor");
  }
  return response.result;
}
