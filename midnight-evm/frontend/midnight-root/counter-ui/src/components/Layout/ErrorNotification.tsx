import { type ReactElement } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ErrorNotificationProps {
  errorMessage: string;
  clearErrorMessage: () => void;
}

export const ErrorNotification = ({ errorMessage, clearErrorMessage }: ErrorNotificationProps): ReactElement => {
  return (
    <Snackbar
      open={errorMessage !== ''}
      onClose={clearErrorMessage}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={clearErrorMessage} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};
