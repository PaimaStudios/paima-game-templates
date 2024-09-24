import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: 'Helvetica',
    allVariants: {
      color: '#222222',
    },
  },
  palette: {
    primary: {
      main: '#009FB7',
    },
    secondary: {
      main: '#ecf0f1',
    },
    background: {
      default: '#464655',
    },
    text: {
      primary: '#ffffff',
    },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },
  },
});
