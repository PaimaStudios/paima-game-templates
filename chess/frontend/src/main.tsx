import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import PageCoordinator from "./pages/PageCoordinator";
import MainController from "./MainController";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

console.log("[ERWT]: Renderer execution started");
export const AppContext = createContext(null);

// custom theme components
declare module "@mui/material/styles" {
  interface TypographyVariants {
    title: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#F2CEAD",
      light: "#FFE6CA",
    },
    secondary: {
      main: "#4B230C",
    },
  },
  typography: {
    fontFamily: ["Inter", "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: 32,
      color: "#FFE6CA",
      fontWeight: 800,
    },
    button: {
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 18,
      color: "#4B230C",
      textTransform: "none",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "transparent",
          fontWeight: 700,
          fontSize: "14px",
          color: "white",
          opacity: 0.6,
        },
        body: {
          fontWeight: 700,
          fontSize: "16px",
          color: "white",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          fontWeight: 500,
          fontSize: "16px",
          color: "white",
        },
        select: { fontWeight: 700 },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: "white" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: "white",
          fontWeight: 700,
          fontSize: "18px",
        },
        notchedOutline: {
          borderColor: "white",
          padding: "0 10px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
          opacity: 0.6,
          fontWeight: 700,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontWeight: 700,
          fontSize: "14px",
        },
      },
    },
  },
});

const mainController = new MainController();
// Application to Render
const app = (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AppContext.Provider value={mainController}>
        <PageCoordinator />
      </AppContext.Provider>
    </BrowserRouter>
  </ThemeProvider>
);

// Render application in DOM
createRoot(document.getElementById("app")).render(app);
