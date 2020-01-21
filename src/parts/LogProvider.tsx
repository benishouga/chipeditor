import React, { ReactNode } from 'react';
import { createTinyContext } from 'tiny-context';

interface LogState {
  log: string[];
}
interface LogAction {
  log: (...messages: string[]) => Promise<void>;
}

const { Provider, useContext } = createTinyContext<LogState, LogAction>({
  log: (state: LogState, ...messages: string[]) => {
    return { ...state, log: messages.reverse().concat(state.log) };
  }
});

export const useLogContext = useContext;
export const LogProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={{ log: [] }}>{children}</Provider>;
};
