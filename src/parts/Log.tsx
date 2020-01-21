import React, { useMemo } from 'react';
import { useBoardContext } from './BoardProvider';
import { useLogContext } from './LogProvider';

export function Log({}) {
  const context = useBoardContext();
  const state = context.state;
  const {
    state: { log },
    actions: { log: l }
  } = useLogContext();
  useMemo(() => {
    const debug = { ...state };
    const main = debug.main;
    delete debug.main;
    delete debug.missile;
    l('----', JSON.stringify(debug, null, '  '), JSON.stringify(main), '----');
  }, [state]);

  return <pre>{log.join('\n')}</pre>;
}
