import { createTheme } from "@mui/material";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 992,
      lg: 1268,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#25515B",
      light: "#57E7FB",
      dark: "#000000",
      contrastText: "#898989",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Inter", "Arial", "sans-serif"].join(","),
    h2: {
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 20,
      color: "white",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    subtitle1: {
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "14px",
      color: "#898989",
    },
    body1: {
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "16px",
      textAlign: "center",
      color: "white",
    },
  },
  components: {
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
    MuiButton: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #57E7FB 0%, #FCA2F9 100%)",
          borderRadius: "4px",
          color: "black",
          fontWeight: 600,
          fontSize: "16px",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#57E7FB",
          },
        },
      },
    },
  },
});
