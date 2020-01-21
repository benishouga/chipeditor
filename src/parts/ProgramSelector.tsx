import React from 'react';
import { useBoardContext } from './BoardProvider';
import { ProgramType } from './ProgramType';

export function ProgramSelector() {
  const {
    state: { targetProgram },
    actions: { setTargetProgram }
  } = useBoardContext();

  return (
    <div>
      {targetProgram}
      <span style={{ marginLeft: '8px' }}>
        <button onClick={() => setTargetProgram(ProgramType.MAIN)}>メイン</button>
        <button onClick={() => setTargetProgram(ProgramType.MISSILE)}>ミサイル</button>
      </span>
    </div>
  );
}
