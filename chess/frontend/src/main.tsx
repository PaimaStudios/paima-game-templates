import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import PageCoordinator from "./pages/PageCoordinator";
import MainController from "./MainController";
import { BrowserRouter } from "react-router-dom";

console.log("[ERWT]: Renderer execution started");
export const AppContext = createContext(null);

const mainController = new MainController();
// Application to Render
const app = (
  <BrowserRouter>
    <AppContext.Provider value={mainController}>
      <PageCoordinator />
    </AppContext.Provider>
  </BrowserRouter>
);

// Render application in DOM
createRoot(document.getElementById("app")).render(app);
