import { createContext, type ReactNode, type ReactElement, useState } from 'react';

import { ErrorNotification } from '../components/Layout/ErrorNotification';

export interface ErrorContextTypes {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  clearErrorMessage: () => void;
}

export const ErrorContext = createContext<ErrorContextTypes | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [error, setError] = useState('');

  const clearErrorMessage = (): void => {
    setError('');
  };

  const setErrorMessage = (message: string): void => {
    setError(message);
  };

  return (
    <ErrorContext.Provider value={{ errorMessage: error, setErrorMessage, clearErrorMessage }}>
      <ErrorNotification errorMessage={error} clearErrorMessage={clearErrorMessage} />
      {children}
    </ErrorContext.Provider>
  );
};
