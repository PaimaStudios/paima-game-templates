import React from "react";
import { createRoot } from "react-dom/client";
import PageCoordinator from "./pages/PageCoordinator";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { GlobalStateProvider } from "./GlobalStateContext";

console.log("[ERWT]: Renderer execution started");

// Application to Render
const app = (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <GlobalStateProvider>
        <PageCoordinator />
      </GlobalStateProvider>
    </BrowserRouter>
  </ThemeProvider>
);

// Render application in DOM
// eslint-disable-next-line @typescript-eslint/no-explicit-any
createRoot(document.getElementById("app") as any).render(app);
