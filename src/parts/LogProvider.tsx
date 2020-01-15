import React, { ReactNode, useState } from 'react';

interface LogState {
  log: string[];
}
interface LogAction {
  log: (...messages: string[]) => void;
}

export const LogContext = React.createContext<{ state: LogState; actions: LogAction }>({
  state: { log: [] },
  actions: { log: () => {} }
});

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LogState>({ log: [] });
  const actions: LogAction = {
    log: (...messages: string[]) => {
      setState({ ...state, log: messages.reverse().concat(state.log) });
    }
  };
  return <LogContext.Provider value={{ state, actions }}>{children}</LogContext.Provider>;
};
