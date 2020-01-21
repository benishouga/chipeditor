import React, { ReactNode } from 'react';
import { createTinyContext, InternalActions } from 'tiny-context';
import { Xy } from './Xy';
// import { LogContext } from './LogProvider';
import { ProgramType } from './ProgramType';
import { MainChipType, MissileChipType } from './ChipType';
import { Direction } from './Direction';

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

interface BoardAction {
  setTargetProgram: (targetProgram: ProgramType) => Promise<void>;
  drag: (position: Xy) => Promise<void>;
  drop: (position: Xy) => Promise<void>;
  startEditing: (position: Xy) => Promise<void>;
  updateEditingChip: (chip: Chip) => Promise<void>;
  finishEditing: () => Promise<void>;
  cancel: () => Promise<void>;
  delete: () => Promise<void>;
  overrideProgram: (program: Program) => Promise<void>;
}
// [[{"type":"scanAttack","next":"downright","branch":"right","direction":0,"angle":90,"range":100},{"type":"back","next":"right"},{"type":"descent","next":"up"},null],[{"type":"ascent","next":"left"},{"type":"altitude","next":"down","branch":"left","greaterOrLess":"less","value":100},null,null],[{"type":"turn","next":"left"},{"type":"scanEnemy","next":"left","branch":"down","direction":0,"angle":180,"range":1000},{"type":"random","next":"right","branch":"downright","greaterOrLess":"greater","value":5},{"type":"fireLaser","next":"right","direction":0,"force":8}],[{"type":"ahead","next":"down"},{"type":"scanEnemy","next":"left","branch":"right","direction":0,"angle":60,"range":200},{"type":"temperature","next":"down","branch":"up","greaterOrLess":"less","value":80},{"type":"fireMissile","next":"down"}]]
const defaultValue: BoardState = {
  main: [],
  missile: [],
  length: 0,
  targetProgram: ProgramType.MAIN,
  targetPosition: null,
  editingChip: null
};

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

const actions = new (class implements InternalActions<BoardState, BoardAction> {
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
    // log(`startEditing ${JSON.stringify(editingChip)}`);
    return { ...state, targetPosition, editingChip };
  }
  setTargetProgram(state: BoardState, targetProgram: ProgramType) {
    const newState = this.applyEdtingChip(state);
    return { ...newState, targetProgram };
  }
  drag(state: BoardState, targetPosition: Xy) {
    const newState = this.applyEdtingChip(state);
    // log('state change @ drag');
    return { ...newState, editingChip: null, targetPosition };
  }
  drop(state: BoardState, dropPosition: Xy) {
    const { main, missile, targetPosition, targetProgram } = state;
    if (targetPosition === null) {
      // log('state change @ error drop');
      return;
    }
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    const chip = program[targetPosition.y][targetPosition.x];
    if (program[dropPosition.y][dropPosition.x]) {
      let newState: BoardState = { ...state, targetPosition: null };
      newState = this.startEditingInternal(newState, targetPosition);
      // log('state change @ rejct drop');
      return { ...newState };
    }
    program[targetPosition.y][targetPosition.x] = null;
    program[dropPosition.y][dropPosition.x] = chip;
    const newState = this.startEditingInternal(state, dropPosition);
    // log('state change @ accept drop');
    return newState;
  }
  startEditing(state: BoardState, targetPosition: Xy) {
    let newState = this.applyEdtingChip(state);
    newState = this.startEditingInternal(newState, targetPosition);
    // log('state change @ startEditing');
    return newState;
  }
  updateEditingChip(state: BoardState, chip: Chip) {
    // log('state change @ updateEditingChip');
    return { ...state, editingChip: { ...chip } };
  }
  finishEditing(state: BoardState) {
    const newState = this.applyEdtingChip(state);
    // log('state change @ finishEditing');
    return newState;
  }
  cancel(state: BoardState) {
    // log('state change @ cancel');
    return { ...state, editingChip: null, targetPosition: null };
  }
  delete(state: BoardState) {
    const { main, missile, targetPosition, targetProgram } = state;
    if (targetPosition === null) {
      return;
    }
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    program[targetPosition.y][targetPosition.x] = null;
    // log('state change @ delete');
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
})();

const { Provider, useContext } = createTinyContext<BoardState, BoardAction>(actions);

export const useBoardContext = useContext;
export const BoardProvider = ({ length, children }: { length: number; children: ReactNode }) => {
  return (
    <Provider
      value={{
        ...defaultValue,
        length,
        main: createEmpty(length),
        missile: createEmpty(length)
      }}
    >
      {children}
    </Provider>
  );
};
