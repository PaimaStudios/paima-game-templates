import { useContext } from 'react';
import { ErrorContext, type ErrorContextTypes } from '../contexts';

export const useErrorContext = (): ErrorContextTypes => {
  const state = useContext(ErrorContext);
  if (state === undefined) {
    throw new Error('Context must be called within a provider.');
  }
  return state;
};
