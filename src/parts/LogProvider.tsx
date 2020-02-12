import React, { ReactNode } from 'react';
import { createTinyContext } from 'tiny-context';

interface LogState {
  log: string[];
}
const { Provider, useContext } = createTinyContext<LogState>().actions({
  log: (state: LogState, ...messages: string[]) => {
    return { log: messages.reverse().concat(state.log) };
  }
});

export const useLogContext = useContext;
export const LogProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={{ log: [] }}>{children}</Provider>;
};
