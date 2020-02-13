import React, { ReactNode } from 'react';
import { createTinyContext } from 'tiny-context';
import { Xy } from './Xy';
import { ProgramType } from './ProgramType';
import { MainChipType, MissileChipType } from './ChipType';
import { Direction } from './Direction';

// Example data
// [[{"type":"scanAttack","next":"downright","branch":"right","direction":0,"angle":90,"range":100},{"type":"back","next":"right"},{"type":"descent","next":"up"},null],[{"type":"ascent","next":"left"},{"type":"altitude","next":"down","branch":"left","greaterOrLess":"less","value":100},null,null],[{"type":"turn","next":"left"},{"type":"scanEnemy","next":"left","branch":"down","direction":0,"angle":180,"range":1000},{"type":"random","next":"right","branch":"downright","greaterOrLess":"greater","value":5},{"type":"fireLaser","next":"right","direction":0,"force":8}],[{"type":"ahead","next":"down"},{"type":"scanEnemy","next":"left","branch":"right","direction":0,"angle":60,"range":200},{"type":"temperature","next":"down","branch":"up","greaterOrLess":"less","value":80},{"type":"fireMissile","next":"down"}]]

export type ChipType = MainChipType | MissileChipType;

export interface Chip {
  type: MainChipType;
  next: Direction;
  [key: string]: any;
}

type Program = (Chip | null)[][];

interface BoardState {
  main: Program;
  missile: Program;
  length: number;
  targetProgram: ProgramType;
  targetPosition: Xy | null;
  editingChip: Chip | null;
}

const createEmpty = (length: number) => {
  const program: Program = [];
  for (let i = 0; i < length; i++) {
    const line = [];
    for (let j = 0; j < length; j++) {
      line.push(null);
    }
    program.push(line);
  }
  return program;
};

class BoardAction {
  private applyEdtingChip(state: BoardState) {
    const { main, missile, targetPosition, targetProgram, editingChip } = state;
    if (targetPosition === null || editingChip === null) {
      return state;
    }
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    program[targetPosition.y][targetPosition.x] = editingChip;
    return { ...state, editingChip: null, targetPosition: null };
  }
  private startEditingInternal(state: BoardState, targetPosition: Xy) {
    const { main, missile, targetProgram } = state;
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    const chip = program[targetPosition.y][targetPosition.x];
    const editingChip: Chip = chip ? { ...chip } : { type: 'nop', next: 'down' };
    return { ...state, targetPosition, editingChip };
  }
  setTargetProgram(state: BoardState, targetProgram: ProgramType) {
    const newState = this.applyEdtingChip(state);
    return { ...newState, targetProgram };
  }
  drag(state: BoardState, targetPosition: Xy) {
    const newState = this.applyEdtingChip(state);
    return { ...newState, editingChip: null, targetPosition };
  }
  drop(state: BoardState, dropPosition: Xy) {
    const { main, missile, targetPosition, targetProgram } = state;
    if (targetPosition === null) {
      return;
    }
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    const chip = program[targetPosition.y][targetPosition.x];
    if (program[dropPosition.y][dropPosition.x]) {
      let newState = this.startEditingInternal(state, targetPosition);
      return { ...newState };
    }
    program[targetPosition.y][targetPosition.x] = null;
    program[dropPosition.y][dropPosition.x] = chip;
    const newState = this.startEditingInternal(state, dropPosition);
    return newState;
  }
  startEditing(state: BoardState, targetPosition: Xy) {
    let newState = { ...state, ...this.applyEdtingChip(state) };
    return this.startEditingInternal(newState, targetPosition);
  }
  updateEditingChip(state: BoardState, chip: Chip) {
    return { ...state, editingChip: { ...chip } };
  }
  finishEditing(state: BoardState) {
    return this.applyEdtingChip(state);
  }
  cancel(state: BoardState) {
    return { ...state, editingChip: null, targetPosition: null };
  }
  delete(state: BoardState) {
    const { main, missile, targetPosition, targetProgram } = state;
    if (targetPosition === null) {
      return;
    }
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    program[targetPosition.y][targetPosition.x] = null;
    return { ...state, editingChip: null, targetPosition: null };
  }
  overrideProgram(state: BoardState, program: Program) {
    const { targetProgram } = state;
    if (targetProgram === ProgramType.MAIN) {
      state.main = program;
    } else {
      state.missile = program;
    }
    return state;
  }
}

const { Provider, useContext } = createTinyContext<BoardState, BoardAction>(new BoardAction());

export const useBoardContext = useContext;
export const BoardProvider = ({ length, children }: { length: number; children: ReactNode }) => {
  return (
    <Provider
      value={{
        targetProgram: ProgramType.MAIN,
        targetPosition: null,
        editingChip: null,
        length,
        main: createEmpty(length),
        missile: createEmpty(length)
      }}
    >
      {children}
    </Provider>
  );
};
