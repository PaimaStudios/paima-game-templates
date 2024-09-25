import { useContext } from 'react';
import { AlertContext, type AlertContextTypes } from '../contexts';

export const useAlertContext = (): AlertContextTypes => {
  const state = useContext(AlertContext);
  if (state === undefined) {
    throw new Error('Context must be called within a provider.');
  }
  return state;
};
