import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { BoardContext } from './BoardProvider';
import { Xy } from './Xy';
import { Chip } from './Chip';
import { ProgramType } from './ProgramType';

export function ChipSocket({ position, size }: { position: Xy; size: number }) {
  const {
    state: { main, missile, targetPosition, editingChip, targetProgram },
    actions: { drop: actionDrop, startEditing }
  } = useContext(BoardContext);

  const isTarget =
    editingChip && targetPosition !== null && targetPosition.x === position.x && targetPosition.y === position.y;

  const border = isTarget ? 'solid 2px #f88' : '';

  const [{ isOver }, drop] = useDrop({
    accept: 'CHIP_SOCKET',
    drop: () => actionDrop(position),
    collect: monitor => ({ isOver: !!monitor.isOver() })
  });
  const program = targetProgram === ProgramType.MAIN ? main : missile;
  const chip = isTarget ? editingChip : program[position.y][position.x];

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        height: `${size}px`,
        width: `${size}px`,
        opacity: isOver ? 0.5 : 1
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: `${size}px`,
          width: `${size}px`
        }}
      >
        {chip !== null ? (
          <Chip position={position} />
        ) : (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e8e8e8',
              width: `${size - 16}px`,
              height: `${size - 16}px`,
              border: 'solid 1px #ddd'
            }}
            onClick={() => startEditing(position)}
          >
            +
          </button>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          width: `${size - 4}px`,
          height: `${size - 4}px`,
          pointerEvents: 'none',
          border
        }}
      ></div>
    </div>
  );
}
