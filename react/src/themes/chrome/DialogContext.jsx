import { createContext, useContext } from 'react';

export const DialogContext = createContext({
  promptAddToMix: () => {},
  openBurnDialog: () => {},
});

export const useDialogs = () => useContext(DialogContext);
