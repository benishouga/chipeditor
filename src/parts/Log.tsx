import React, { useContext, useMemo } from 'react';
import { BoardContext } from './BoardProvider';
import { LogContext } from './LogProvider';

export function Log({}) {
  const context = useContext(BoardContext);
  const state = context.state;
  const {
    state: { log },
    actions: { log: l }
  } = useContext(LogContext);
  useMemo(() => {
    const debug = { ...state };
    const main = debug.main;
    delete debug.main;
    delete debug.missile;
    l('----', JSON.stringify(debug, null, '  '), JSON.stringify(main), '----');
  }, [state]);

  return <pre>{log.join('\n')}</pre>;
}
