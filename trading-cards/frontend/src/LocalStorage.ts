import type { CardDbId, LocalCard } from "@cards/game-logic";

function setLobbyDeck(lobbyId: string, cards: LocalCard[]) {
  localStorage.setItem(`lobbyDeck_${lobbyId}`, JSON.stringify(cards));
}

function getLobbyDeck(lobbyId: string): undefined | LocalCard[] {
  const raw = localStorage.getItem(`lobbyDeck_${lobbyId}`);
  return raw == null ? undefined : JSON.parse(raw);
}

/** Use GlobalStateContext */
function _setSelectedDeck(cards: undefined | CardDbId[]) {
  localStorage.setItem(
    `selectedDeck`,
    cards == null ? "null" : JSON.stringify(cards)
  );
}

/** Use GlobalStateContext */
function _getSelectedDeck(): undefined | CardDbId[] {
  const raw = localStorage.getItem(`selectedDeck`);
  return raw == null ? undefined : JSON.parse(raw);
}

export default {
  setLobbyDeck,
  getLobbyDeck,
  _setSelectedDeck,
  _getSelectedDeck,
};
