import React from "react";
import MainMenu from "./MainMenu";
import OpenLobbies from "./OpenLobbies";
import MyGames from "./MyGames";
import CreateLobby from "./CreateLobby";
import { Routes, Route } from "react-router-dom";
import "./PageCoordinator.scss";
import { Lobby } from "./CardGame/Lobby";
import BuyPack from "./BuyPack";
import Collection from "./Collection";
import TradeNfts from "./TradeNfts";

export enum Page {
  MainMenu = "/",
  CreateLobby = "/create_lobby",
  OpenLobbies = "/open_lobbies",
  Game = "/game",
  MyGames = "/my_games",
  Collection = "/collection",
  BuyPacks = "/buy_packs",
  TradeNfts = "/trade_nfts",
}

const PageCoordinator: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path={Page.MainMenu} element={<MainMenu />} />
        <Route path={Page.OpenLobbies} element={<OpenLobbies />} />
        <Route path={Page.MyGames} element={<MyGames />} />
        <Route path={Page.Game} element={<Lobby />} />
        <Route path={Page.CreateLobby} element={<CreateLobby />} />
        <Route path={Page.Collection} element={<Collection />} />
        <Route path={Page.BuyPacks} element={<BuyPack />} />
        <Route path={Page.TradeNfts} element={<TradeNfts />} />
        <Route element={<div>There was something wrong...</div>} />
      </Routes>
    </div>
  );
};

export default PageCoordinator;
