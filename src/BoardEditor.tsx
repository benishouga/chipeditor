import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { BoardProvider } from './parts/BoardProvider';
import { Board } from './parts/Board';
import { ProgramSelector } from './parts/ProgramSelector';
import { ChipEditor } from './parts/ChipEditor';
import { LogProvider } from './parts/LogProvider';
import { Log } from './parts/Log';

export function BoardEditor() {
  return (
    <LogProvider>
      <BoardProvider length={4}>
        <ProgramSelector />
        <DndProvider backend={Backend}>
          <Board />
        </DndProvider>
        <ChipEditor />
        <Log />
      </BoardProvider>
    </LogProvider>
  );
}
