import type { SetStateAction } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UseStateResponse } from "./utils";
import type { WalletAddress } from "@paima/sdk/utils";
import * as Paima from "@cards/middleware";
import ConnectingModal from "./ConnectingModal";
import {
  AstarNotice,
  PaimaNotice,
  PolygonNotice,
} from "./components/PaimaNotice";
import type { CardDbId, LocalCard } from "@cards/game-logic";
import type {
  IGetBoughtPacksResult,
  IGetCardsByIdsResult,
  IGetLobbyByIdResult,
  IGetOwnedCardsResult,
  IGetTradeNftsResult,
} from "@cards/db/build/select.queries";
import LocalStorage from "./LocalStorage";

export const localDeckCache: Map<string, LocalCard[]> = new Map();

export type Collection = {
  /** emphasis on **bought**, user might not own all cards in them anymore */
  boughtPacks?: IGetBoughtPacksResult[];
  cards?: Record<CardDbId, IGetOwnedCardsResult>;
};

type GlobalState = {
  connectedWallet?: WalletAddress;
  selectedNftState: UseStateResponse<{
    loading: boolean;
    nft: undefined | number;
  }>;
  collection: Collection;
  selectedDeckState: UseStateResponse<undefined | CardDbId[]>;
  tradeNfts:
    | undefined
    | {
        tradeNfts: IGetTradeNftsResult[];
        cardLookup: Record<string, IGetCardsByIdsResult>;
      };
  joinedLobbyRawState: UseStateResponse<undefined | IGetLobbyByIdResult>;
};

export const GlobalStateContext = createContext<GlobalState>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any as GlobalState,
);

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  useEffect(() => {
    const setFocus = () => {
      setIsPageVisible(true);
    }
    const setBlur = () => {
      setIsPageVisible(false);
    }

    window.addEventListener("blur", setBlur);
    window.addEventListener("focus", setFocus);

    return () => {
      window.removeEventListener("blur", setBlur);
      window.removeEventListener("focus", setFocus);
    };
  }, []);

  const [connectedWallet, setConnectedWallet] = useState<
    undefined | WalletAddress
  >();
  const [selectedNft, setSelectedNft] = useState<{
    loading: boolean;
    nft: undefined | number;
  }>({
    loading: true,
    nft: undefined,
  });
  const [collection, setCollection] = useState<Collection>({});
  const [tradeNfts, setTradeNfts] = useState<
    | undefined
    | {
        tradeNfts: IGetTradeNftsResult[];
        cardLookup: Record<string, IGetCardsByIdsResult>;
      }
  >();
  const joinedLobbyRawState = useState<undefined | IGetLobbyByIdResult>();

  const [selectedDeckSubscription, setSelectedDeckSubscription] =
    useState<number>(0);
  const selectedDeck = useMemo(() => {
    const result = LocalStorage._getSelectedDeck();
    if (
      collection.cards != null &&
      result?.some((card) => collection.cards?.[card] == null)
    ) {
      LocalStorage._setSelectedDeck(undefined);
      return undefined;
    }

    // Make this hook depend on selectedDeckSubscription.
    // Less likely to break stuff than ignoring the entire exhaustive hooks rule.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = selectedDeckSubscription;

    return result;
  }, [collection, selectedDeckSubscription]);
  const setSelectedDeck = useCallback(
    (cards: SetStateAction<undefined | CardDbId[]>) => {
      if (typeof cards === "function") {
        throw new Error(
          `setSelectedDeck: function set state action not supported`,
        );
      }

      LocalStorage._setSelectedDeck(cards);
      setSelectedDeckSubscription((old) => old + 1);
    },
    [],
  );

  useEffect(() => {
    // poll owned nfts
    const fetch = async () => {
      if (connectedWallet == null) return;

      const result = await Paima.default.getNftForWallet(connectedWallet);
      if (
        result.success &&
        (result.result == null ||
          result.result.nft == null ||
          result.result.nft !== selectedNft.nft)
      ) {
        setSelectedNft({
          loading: false,
          nft: result.result.nft,
        });
      }
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [connectedWallet, selectedNft.nft]);

  useEffect(() => {
    // poll collection
    const fetch = async () => {
      if (selectedNft.nft == null) return;

      Promise.all([
        (async () => {
          if (selectedNft.nft == null) return;

          const result = await Paima.default.getUserPacks(selectedNft.nft);
          if (result.success) {
            setCollection((oldCollection) => ({
              ...oldCollection,
              boughtPacks: result.result.packs,
            }));
          }
        })(),
        (async () => {
          if (selectedNft.nft == null) return;

          const result = await Paima.default.getUserCards(selectedNft.nft);
          if (result.success) {
            const raw = result.result;
            const cards = Object.fromEntries(
              raw.cards.map((entry) => [entry.id, entry]),
            );

            setCollection((oldCollection) => ({
              ...oldCollection,
              cards,
            }));
          }
        })(),
      ]);
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [selectedNft.nft]);

  useEffect(() => {
    // poll connection to wallet
    const fetch = async () => {
      // avoid aggressively trying to change the wallet if the user isn't looking at the game
      if (connectedWallet != null && !isPageVisible) return;
      const connectResult = await Paima.default.userWalletLogin("metamask");
      const newWallet = connectResult.success
        ? connectResult.result.walletAddress
        : undefined;
      setConnectedWallet(oldWallet => newWallet == null ? oldWallet : newWallet);
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [connectedWallet, isPageVisible]);

  useEffect(() => {
    // poll trade nfts
    const fetch = async () => {
      if (selectedNft.nft == null) return;

      const result = await Paima.default.getUserTradeNfts(selectedNft.nft);
      if (result.success) setTradeNfts(result.result);
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [selectedNft.nft]);

  // if a user disconnects, we will suspend the pages the previously connected wallet
  // instead of setting connected wallet back to undefined
  const [lastConnectedWallet, setLastConnectedWallet] = useState<
    undefined | WalletAddress
  >();
  useEffect(() => {
    if (connectedWallet == null) return;

    setLastConnectedWallet(connectedWallet);
  }, [connectedWallet]);

  const value = useMemo<GlobalState>(
    () => ({
      connectedWallet: lastConnectedWallet,
      selectedNftState: [selectedNft, setSelectedNft],
      collection,
      selectedDeckState: [selectedDeck, setSelectedDeck],
      tradeNfts,
      joinedLobbyRawState,
    }),
    [
      collection,
      lastConnectedWallet,
      selectedDeck,
      selectedNft,
      setSelectedDeck,
      tradeNfts,
      joinedLobbyRawState,
    ],
  );

  return (
    <GlobalStateContext.Provider value={value}>
      <ConnectingModal open={connectedWallet == null} />
      {children}
      <PaimaNotice />
      {/* <br />
      <AstarNotice />
      <br />
      <PolygonNotice /> */}
    </GlobalStateContext.Provider>
  );
}

export const useGlobalStateContext = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (context == null) {
    throw new Error(
      "useGlobalStateContext must be used within an GlobalStateProvider",
    );
  }
  return context;
};
