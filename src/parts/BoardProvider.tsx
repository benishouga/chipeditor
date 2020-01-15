import React, { useState, ReactNode, useContext } from 'react';
import { Xy } from './Xy';
import { LogContext } from './LogProvider';
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
  setTargetProgram: (targetProgram: ProgramType) => void;
  drag: (position: Xy) => void;
  drop: (position: Xy) => void;
  startEditing: (position: Xy) => void;
  updateEditingChip: (chip: Chip) => void;
  finishEditing: () => void;
  cancel: () => void;
  delete: () => void;
  overrideProgram: (program: Program) => void;
}

type Internal<S, A extends { [P in keyof A]: (...args: any) => any }> = {
  [P in keyof A]: (...args: Parameters<A[P]>) => S | null | undefined | Promise<S>;
};
type BoardActionInternal = Internal<BoardState, BoardAction>;

function create(setState: (state: BoardState) => void, obj: BoardActionInternal): BoardAction {
  const result: any = {};
  Object.entries(obj).forEach(([name, method]) => {
    result[name] = (...argument: any[]) => {
      const state = (method as any)(...argument);
      if (!state) {
        return;
      }
      if (state instanceof Promise) {
        state.then(state => {
          if (state) {
            setState({ ...state });
          }
        });
        return;
      }
      setState({ ...state });
    };
  });
  return result;
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

export const BoardContext = React.createContext<{ state: BoardState; actions: BoardAction }>({
  state: defaultValue,
  actions: {
    setTargetProgram: () => {},
    drag: () => {},
    drop: () => {},
    startEditing: () => {},
    updateEditingChip: () => {},
    finishEditing: () => {},
    cancel: () => {},
    delete: () => {},
    overrideProgram: () => {}
  }
});

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

export const BoardProvider = ({ length, children }: { length: number; children: ReactNode }) => {
  const {
    actions: { log }
  } = useContext(LogContext);

  const [state, setState] = useState<BoardState>({
    ...defaultValue,
    length,
    main: createEmpty(length),
    missile: createEmpty(length)
  });
  const { main, missile, targetPosition, targetProgram, editingChip } = state;

  const applyEdtingChip = (state: BoardState) => {
    if (targetPosition === null || editingChip === null) {
      return state;
    }
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    program[targetPosition.y][targetPosition.x] = editingChip;
    return { ...state, editingChip: null, targetPosition: null };
  };
  const startEditing = (state: BoardState, targetPosition: Xy) => {
    const program = targetProgram === ProgramType.MAIN ? main : missile;
    const chip = program[targetPosition.y][targetPosition.x];
    const editingChip: Chip = chip ? { ...chip } : { type: 'nop', next: 'down' };
    log(`startEditing ${JSON.stringify(editingChip)}`);
    return { ...state, targetPosition, editingChip };
  };

  const actions: BoardActionInternal = {
    setTargetProgram: targetProgram => {
      const newState = applyEdtingChip(state);
      return { ...newState, targetProgram };
    },
    drag: targetPosition => {
      const newState = applyEdtingChip(state);
      log('state change @ drag');
      return { ...newState, editingChip: null, targetPosition };
    },
    drop: (dropPosition: Xy) => {
      if (targetPosition === null) {
        log('state change @ error drop');
        return;
      }
      const program = targetProgram === ProgramType.MAIN ? main : missile;
      const chip = program[targetPosition.y][targetPosition.x];
      if (program[dropPosition.y][dropPosition.x]) {
        // TODO: ドラッグ先にすでに chip があったときの挙動が変。ドラッグ開始時の処理がおかしい？。。。。
        console.log(dropPosition);
        console.log(targetPosition);
        let newState: BoardState = { ...state, targetPosition: null };
        newState = startEditing(newState, targetPosition);
        log('state change @ rejct drop');
        setState({ ...newState });
        return;
      }
      program[targetPosition.y][targetPosition.x] = null;
      program[dropPosition.y][dropPosition.x] = chip;
      const newState = startEditing(state, dropPosition);
      log('state change @ accept drop');
      return newState;
    },
    startEditing: targetPosition => {
      let newState = applyEdtingChip(state);
      newState = startEditing(newState, targetPosition);
      log('state change @ startEditing');
      return newState;
    },
    updateEditingChip: chip => {
      log('state change @ updateEditingChip');
      return { ...state, editingChip: { ...chip } };
    },
    finishEditing: () => {
      const newState = applyEdtingChip(state);
      log('state change @ finishEditing');
      return newState;
    },
    cancel: () => {
      log('state change @ cancel');
      return { ...state, editingChip: null, targetPosition: null };
    },
    delete: () => {
      if (targetPosition === null) {
        return;
      }
      const program = targetProgram === ProgramType.MAIN ? main : missile;
      program[targetPosition.y][targetPosition.x] = null;
      log('state change @ delete');
      return { ...state, editingChip: null, targetPosition: null };
    },
    overrideProgram: program => {
      if (targetProgram === ProgramType.MAIN) {
        state.main = program;
      } else {
        state.missile = program;
      }
      return state;
    }
  };

  return (
    <BoardContext.Provider value={{ state, actions: create(setState, actions) }}>{children}</BoardContext.Provider>
  );
};
