import { useContext } from 'react';
import { AppContext, type AppContextTypes } from '../contexts';

export const useAppContext = (): AppContextTypes => {
  const state = useContext(AppContext);
  if (state === undefined) {
    throw new Error('Context must be called within a provider.');
  }
  return state;
};
