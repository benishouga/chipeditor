import React, { PropsWithChildren } from 'react';
import { useBoardContext, Chip } from './BoardProvider';
import { selectChipUi } from './Chips';
import { MainChipType, MainChipTypeValues } from './ChipType';
import { Direction, DirectionValues } from './Direction';

export function ChipEditor() {
  const {
    state: { editingChip },
    actions: { updateEditingChip, finishEditing, cancel, delete: del }
  } = useBoardContext();

  if (!editingChip) {
    return null;
  }

  const typeHandler = (type: MainChipType) => () => {
    const factory = selectChipUi(type);
    const f = factory.init(editingChip);
    console.log(f);
    return updateEditingChip({ ...f });
  };
  const nextHandler = (next: Direction) => () => editingChip && updateEditingChip({ ...editingChip, next });
  const chipUi = editingChip ? selectChipUi(editingChip.type) : null;

  return (
    <div>
      <p>
        {MainChipTypeValues.map(v => (
          <button key={v} onClick={typeHandler(v)}>
            {v}
          </button>
        ))}
      </p>
      <p>
        {DirectionValues.map(v => (
          <button key={v} onClick={nextHandler(v)}>
            {v}
          </button>
        ))}
      </p>
      {chipUi && editingChip ? (
        <div
          style={{
            height: '80px',
            width: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <chipUi.Chip chip={editingChip} />
        </div>
      ) : null}
      {chipUi && editingChip ? <chipUi.Editor chip={editingChip} onChipUpdate={updateEditingChip} /> : null}
      <button onClick={() => finishEditing()}>finish</button>
      <button onClick={() => cancel()}>cancel</button>
      <button onClick={() => del()}>delete</button>
    </div>
  );
}
