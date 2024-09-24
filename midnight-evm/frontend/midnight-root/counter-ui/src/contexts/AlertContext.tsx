import { createContext, type ReactNode, type ReactElement, useState } from 'react';

import { AlertDialog } from '../components';

interface ConfirmationTypes {
  title: string;
  text?: string;
  callback: ((confirmed: boolean) => void) | undefined;
}

export interface AlertContextTypes {
  confirmation: ConfirmationTypes;
  isOpen: boolean;
  askForConfirmation: (params: ConfirmationTypes) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const AlertContext = createContext<AlertContextTypes | undefined>(undefined);

const INITIAL_CONFIRMATION_STATE: ConfirmationTypes = {
  title: '',
  text: '',
  callback: undefined,
};

export const AlertProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [confirmation, setConfirmation] = useState(INITIAL_CONFIRMATION_STATE);
  const [isOpen, setIsOpen] = useState(false);

  const reset = (): void => {
    setConfirmation(INITIAL_CONFIRMATION_STATE);
    setIsOpen(false);
  };

  const onConfirm = (): void => {
    reset();

    if (typeof confirmation.callback === 'function') {
      confirmation.callback(true);
    }
  };

  const onCancel = (): void => {
    reset();
  };

  const askForConfirmation = ({ title, text, callback }: ConfirmationTypes): void => {
    setIsOpen(true);
    setConfirmation({
      title,
      text,
      callback,
    });
  };

  return (
    <AlertContext.Provider value={{ onCancel, onConfirm, confirmation, isOpen, askForConfirmation }}>
      <AlertDialog
        isOpen={isOpen}
        title={confirmation.title}
        text={confirmation.text}
        handleClose={onCancel}
        callback={onConfirm}
      />
      {children}
    </AlertContext.Provider>
  );
};
