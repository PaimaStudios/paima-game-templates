import { type ReactElement } from 'react';
import { Backdrop, Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface BackdropLoaderProps {
  title?: string;
}

export const BackdropLoader = ({ title }: BackdropLoaderProps): ReactElement => {
  const theme = useTheme();

  return (
    <Backdrop sx={{ color: 'white', zIndex: theme.zIndex.drawer + 1 }} open>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress data-testid="backdrop-loader-spinner" color="inherit" />
        <Typography data-testid="backdrop-loader-title" sx={{ mt: 2 }} color="inherit" variant="h4">
          Please wait
        </Typography>
        {title && (
          <Typography data-testid="backdrop-loader-subtitle" sx={{ mt: 2 }} color="inherit" variant="h4">
            {title}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};
