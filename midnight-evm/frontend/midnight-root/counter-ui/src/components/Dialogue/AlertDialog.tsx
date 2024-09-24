import { type ReactElement } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button, DialogTitle, Box } from '@mui/material';

import { MISC } from '../../locale';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  text?: string;
  handleClose: () => void;
  callback?: () => void;
}

export const AlertDialog = ({ isOpen, title, text, handleClose, callback }: AlertDialogProps): ReactElement => {
  return (
    <Dialog open={isOpen} onClose={handleClose} aria-describedby="alert-dialog-title" maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 6,
          px: 10,
          overflowWrap: 'anywhere',
        }}
      >
        <DialogTitle
          color="#222"
          fontSize={'1.75rem'}
          sx={{ pt: 0 }}
          id="alert-dialog-title"
          data-testid="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent sx={{ px: 12, textAlign: 'center' }}>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            data-testid="alert-dialog-cancel-button"
            sx={{ px: 6, mr: 2 }}
            onClick={handleClose}
          >
            {MISC.no}
          </Button>
          <Button
            variant="contained"
            data-testid="alert-dialog-accept-button"
            color="success"
            sx={{ px: 6 }}
            onClick={callback}
            autoFocus
          >
            {MISC.yes}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
