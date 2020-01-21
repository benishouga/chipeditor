import React from 'react';
import { useDrag } from 'react-dnd';
import { useBoardContext } from './BoardProvider';
import { Xy } from './Xy';
import { selectChipUi } from './Chips';
import { ProgramType } from './ProgramType';
import { Direction } from './Direction';

const m = new Map<Direction, { [key: string]: string }>();
m.set('up', { position: 'absolute', top: '0', left: '35%' });
m.set('upright', { position: 'absolute', top: '0', right: '0', transform: 'rotate(45deg)' });
m.set('right', { position: 'absolute', top: '55%', right: '0', transform: 'rotate(90deg)' });
m.set('downright', { position: 'absolute', bottom: '0', right: '0', transform: 'rotate(135deg)' });
m.set('down', { position: 'absolute', bottom: '0', left: '55%', transform: 'rotate(180deg)' });
m.set('downleft', { position: 'absolute', bottom: '0', left: '0', transform: 'rotate(225deg)' });
m.set('left', { position: 'absolute', top: '35%', left: '0', transform: 'rotate(270deg)' });
m.set('upleft', { position: 'absolute', top: '0', left: '0', transform: 'rotate(315deg)' });

function Arrow({ next, color = '' }: { next: Direction; color?: string }) {
  const style = m.get(next);
  return style ? <div style={{ ...style, color, fontWeight: color ? 'bold' : undefined }}>↑</div> : null;
}

export function Chip({ position }: { position: Xy }) {
  const {
    state: { main, missile, targetPosition, editingChip, targetProgram },
    actions: { startEditing, drag: actionDrag }
  } = useBoardContext();

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'CHIP_SOCKET' },
    begin: () => {
      actionDrag(position);
    },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  });

  const isTarget =
    editingChip && targetPosition !== null && targetPosition.x === position.x && targetPosition.y === position.y;
  const program = targetProgram === ProgramType.MAIN ? main : missile;
  const chip = isTarget ? editingChip : program[position.y][position.x];

  if (!chip) {
    return null;
  }

  const chipUi = selectChipUi(chip.type);

  return (
    <div
      ref={drag}
      onClick={() => startEditing(position)}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative'
      }}
    >
      <div
        style={{
          height: '80%',
          width: '80%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff'
        }}
      >
        <chipUi.Chip chip={chip} />
      </div>
      {chip['branch'] ? <Arrow next={chip['branch']} color="#f00" /> : null}
      <Arrow next={chip.next} />
    </div>
  );
}
