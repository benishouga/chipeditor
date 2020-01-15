import React, { useContext } from 'react';
import { BoardContext } from './BoardProvider';
import { ChipSocket } from './ChipSocket';
import { ProgramType } from './ProgramType';

const EDITOR_SIZE = 400;

export function Board() {
  const {
    state: { length, targetProgram, main, missile },
    actions: { overrideProgram }
  } = useContext(BoardContext);

  const size = EDITOR_SIZE / length;
  const chips = [];
  for (let y = 0; y < length; y++) {
    for (let x = 0; x < length; x++) {
      chips.push(<ChipSocket key={`${x}_${y}`} position={{ x, y }} size={size} />);
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: `100%` }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: `${EDITOR_SIZE}px` }}>{chips}</div>
      <div>
        <textarea
          style={{ border: 'solid 1px #eee', height: '360px', width: '300px', color: '#aaa' }}
          value={JSON.stringify(targetProgram === ProgramType.MAIN ? main : missile, null, ' ')}
          onChange={e => overrideProgram(JSON.parse(e.target.value))}
        />
      </div>
    </div>
  );
}
