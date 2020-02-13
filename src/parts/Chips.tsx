import React, { PropsWithChildren } from 'react';
import { Chip, ChipType } from './BoardProvider';
import Arc from './Arc';
import { Direction, DirectionValues } from './Direction';
import { MainChipType } from './ChipType';

interface ConditionChip extends Chip {
  branch: Direction;
}

interface CheckChip extends ConditionChip {
  greaterOrLess: 'greater' | 'less';
  value: number;
}

interface VariableActionChip extends Chip {
  value: number;
}

interface ScanChip extends ConditionChip {
  direction: number;
  angle: number;
  range: number;
}

interface FireLaserChip extends Chip {
  direction: number;
  force: number;
}

interface LogChip extends Chip {
  message: string;
}

interface ScanDebugChip extends Chip {
  direction: number;
  angle: number;
  range: number;
}

const LimitableInput = ({
  value,
  min,
  max,
  step,
  onChange
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) => {
  const normalize = (value: number) => {
    if (min !== undefined && value < min) {
      return min;
    }
    if (max !== undefined && max < value) {
      return max;
    }
    return value;
  };
  value = normalize(value);
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => {
        onChange(normalize(Number(e.target.value)));
      }}
    />
  );
};

const SimpleActionChip = ({ label, description }: { label: string; description?: string }) => {
  return (
    <span style={{ textAlign: 'center' }}>
      {label}
      {description ? (
        <>
          <br />
          {description}
        </>
      ) : null}
    </span>
  );
};

// variable action chip
const VariableActionChip = ({ chip, label }: { chip: VariableActionChip; label: string }) => {
  return (
    <span style={{ textAlign: 'center' }}>
      {label}
      <br />
      {chip.value || 0}
    </span>
  );
};

const VariableActionChipEditor = ({
  chip,
  min = 0,
  max = 100,
  step = 1,
  onChipUpdate
}: {
  chip: VariableActionChip;
  min?: number;
  max?: number;
  step?: number;
  onChipUpdate: (chip: Chip) => void;
}) => {
  return (
    <div>
      値：
      <input
        type="number"
        value={chip.value}
        min={min}
        max={max}
        step={step}
        onChange={e => {
          onChipUpdate({ ...chip, value: e.target.value });
        }}
      />
    </div>
  );
};

const UpdateBranchButtons = ({ chip, onChipUpdate }: { chip: ConditionChip; onChipUpdate: (chip: Chip) => void }) => {
  const branchHandler = (branch: Direction) => () => onChipUpdate({ ...chip, branch });
  return (
    <>
      {DirectionValues.map(v => (
        <button key={v} onClick={branchHandler(v)}>
          {v}
        </button>
      ))}
    </>
  );
};

// check chip
const CheckChip = ({ chip, label }: { chip: CheckChip; label: string }) => {
  return (
    <span style={{ textAlign: 'right' }}>
      {chip.greaterOrLess === 'greater' ? (
        <>
          {label}≥
          <br />
          {chip.value || 0}
        </>
      ) : (
        <>
          {label}≤
          <br />
          {chip.value || 0}
        </>
      )}
    </span>
  );
};
const CheckChipEditor = ({
  chip,
  min = 0,
  max = 100,
  step = 1,
  onChipUpdate
}: {
  chip: CheckChip;
  min?: number;
  max?: number;
  step?: number;
  onChipUpdate: (chip: Chip) => void;
}) => {
  return (
    <>
      <p>
        <UpdateBranchButtons chip={chip} onChipUpdate={onChipUpdate} />
      </p>
      <p>
        以上or以下：
        <input
          type="radio"
          id="greater"
          name="greaterOrLess"
          value="greater"
          checked={chip.greaterOrLess === 'greater'}
          onChange={e => {
            onChipUpdate({ ...chip, greaterOrLess: e.target.value });
          }}
        />
        <label htmlFor="greater">greater</label>
        <input
          type="radio"
          id="less"
          name="greaterOrLess"
          value="less"
          checked={chip.greaterOrLess === 'less'}
          onChange={e => {
            onChipUpdate({ ...chip, greaterOrLess: e.target.value });
          }}
        />
        <label htmlFor="less">less</label>
      </p>
      <p>
        値：
        <LimitableInput
          value={chip.value}
          min={min}
          max={max}
          step={step}
          onChange={value => onChipUpdate({ ...chip, value })}
        />
      </p>
    </>
  );
};
// check chip
const ScanChip = ({ chip: { direction = 0, angle = 90, range = 0 }, label }: { chip: ScanChip; label: string }) => {
  const size = 32;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {label}
        <svg
          style={{ marginLeft: '4px' }}
          transform={`scale(1, -1)`}
          width={size}
          height={size}
          viewBox={`${-size / 2 + 0.5} ${-size / 2 + 0.5} ${size} ${size}`}
        >
          <Arc direction={direction} angle={360} renge={size / 2} fillColor="#e8e8e8" />
          <Arc direction={direction} angle={angle} renge={size / 2} />
        </svg>
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>{range}m</div>
    </div>
  );
};
const ScanChipEditor = ({ chip, onChipUpdate }: { chip: ScanChip; onChipUpdate: (chip: Chip) => void }) => {
  return (
    <div>
      <p>
        <UpdateBranchButtons chip={chip} onChipUpdate={onChipUpdate} />
      </p>
      <p>
        方向：
        <LimitableInput
          value={chip.direction}
          min={0}
          max={360}
          step={5}
          onChange={value => onChipUpdate({ ...chip, direction: value })}
        />
      </p>
      <p>
        範囲：
        <LimitableInput
          value={chip.angle}
          min={0}
          max={360}
          step={5}
          onChange={value => onChipUpdate({ ...chip, angle: value })}
        />
      </p>
      <p>
        距離：
        <LimitableInput
          value={chip.range}
          min={0}
          max={1000}
          step={5}
          onChange={value => onChipUpdate({ ...chip, range: value })}
        />
      </p>
    </div>
  );
};
const FireLaserChip = ({ chip: { direction, force = 0 } }: { chip: FireLaserChip }) => {
  const size = 32;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        🔫
        <svg
          style={{ marginLeft: '4px' }}
          transform={`scale(1, -1)`}
          width={size}
          height={size}
          viewBox={`${-size / 2 + 0.5} ${-size / 2 + 0.5} ${size} ${size}`}
        >
          <Arc direction={direction} angle={360} renge={size / 2} fillColor="#e8e8e8" />
          <Arc direction={direction} angle={1} renge={size / 2} />
        </svg>
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>{force}</div>
    </div>
  );
};

const FireLaserChipEditor = ({ chip, onChipUpdate }: { chip: FireLaserChip; onChipUpdate: (chip: Chip) => void }) => {
  return (
    <div>
      <p>
        方向：
        <LimitableInput
          value={chip.direction}
          min={0}
          max={360}
          step={5}
          onChange={value => onChipUpdate({ ...chip, direction: value })}
        />
      </p>
      <p>
        強さ：
        <LimitableInput
          value={chip.force}
          min={3}
          max={8}
          step={1}
          onChange={value => onChipUpdate({ ...chip, force: value })}
        />
      </p>
    </div>
  );
};

const FireMissileChip = () => {
  return <span style={{ textAlign: 'center' }}>🚀</span>;
};

const LogChip = ({ chip }: { chip: LogChip }) => {
  return (
    <span style={{ textAlign: 'center' }}>
      📝
      {chip.message ? (
        <>
          <br />
          {chip.message.length < 5 ? chip.message.substring(0, 5) : chip.message.substring(0, 4) + '...'}
        </>
      ) : null}
    </span>
  );
};

const LogChipEditor = ({ chip, onChipUpdate }: { chip: LogChip; onChipUpdate: (chip: Chip) => void }) => {
  return (
    <p>
      メッセージ：
      <input
        type="text"
        value={chip.direction}
        onChange={e => {
          onChipUpdate({ ...chip, message: e.target.value });
        }}
      />
    </p>
  );
};

// check chip
const ScanDebugChip = ({ chip: { direction = 0, angle = 90, range = 0 } }: { chip: ScanDebugChip }) => {
  const size = 32;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        🐜
        <svg
          style={{ marginLeft: '4px' }}
          transform={`scale(1, -1)`}
          width={size}
          height={size}
          viewBox={`${-size / 2 + 0.5} ${-size / 2 + 0.5} ${size} ${size}`}
        >
          <Arc direction={direction} angle={360} renge={size / 2} fillColor="#e8e8e8" />
          <Arc direction={direction} angle={angle} renge={size / 2} />
        </svg>
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>{range}m</div>
    </div>
  );
};
const ScanDebugChipEditor = ({ chip, onChipUpdate }: { chip: ScanDebugChip; onChipUpdate: (chip: Chip) => void }) => {
  return (
    <div>
      <p>
        方向：
        <LimitableInput
          value={chip.direction}
          min={0}
          max={360}
          step={5}
          onChange={value => onChipUpdate({ ...chip, direction: value })}
        />
      </p>
      <p>
        範囲：
        <LimitableInput
          value={chip.angle}
          min={0}
          max={360}
          step={5}
          onChange={value => onChipUpdate({ ...chip, angle: value })}
        />
      </p>
      <p>
        距離：
        <LimitableInput
          value={chip.range}
          min={0}
          max={1000}
          step={5}
          onChange={value => onChipUpdate({ ...chip, range: value })}
        />
      </p>
    </div>
  );
};

type ChipProps = PropsWithChildren<{ chip: Chip }>;
type ChipEditorProps = PropsWithChildren<{ chip: Chip; onChipUpdate: (chip: Chip) => void }>;

interface ChipUiFactory {
  init: (prev?: Chip) => Chip;
  Chip: React.FC<ChipProps>;
  Editor: React.FC<ChipEditorProps>;
}

const factories = new Map<ChipType, ChipUiFactory>();

factories.set(MainChipType.nop, {
  init: (prev?: Chip) => ({ type: MainChipType.nop, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <SimpleActionChip label="-" />,
  Editor: () => null
});
factories.set(MainChipType.ahead, {
  init: (prev?: Chip) => ({ type: MainChipType.ahead, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <SimpleActionChip label="➡" description="前進" />,
  Editor: () => null
});
factories.set(MainChipType.back, {
  init: (prev?: Chip) => ({ type: MainChipType.back, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <SimpleActionChip label="⬅" description="後退" />,
  Editor: () => null
});
factories.set(MainChipType.ascent, {
  init: (prev?: Chip) => ({ type: MainChipType.ascent, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <SimpleActionChip label="⤴" description="上昇" />,
  Editor: () => null
});
factories.set(MainChipType.descent, {
  init: (prev?: Chip) => ({ type: MainChipType.descent, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <SimpleActionChip label="⤵" description="下降" />,
  Editor: () => null
});
factories.set(MainChipType.turn, {
  init: (prev?: Chip) => ({ type: MainChipType.turn, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <SimpleActionChip label="↩" description="ターン" />,
  Editor: () => null
});

factories.set(MainChipType.wait, {
  init: (prev?: Chip) =>
    ({ type: MainChipType.wait, next: prev ? prev.next : Direction.down, value: 0 } as VariableActionChip),
  Chip: ({ chip }: ChipProps) => <VariableActionChip chip={chip as VariableActionChip} label="⌛" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <VariableActionChipEditor
      chip={chip as VariableActionChip}
      onChipUpdate={onChipUpdate}
      min={0}
      max={1000}
      step={1}
    />
  )
});

factories.set(MainChipType.frame, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.frame,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 50
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="⏱" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={10000} step={1} />
  )
});
factories.set(MainChipType.fuel, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.fuel,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 50
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="⛽" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={100} step={5} />
  )
});
factories.set(MainChipType.altitude, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.altitude,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 100
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="↕" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={1000} step={5} />
  )
});
factories.set(MainChipType.shield, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.shield,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 50
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="🛡" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={100} step={5} />
  )
});
factories.set(MainChipType.temperature, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.temperature,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 50
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="🌡" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={100} step={5} />
  )
});
factories.set(MainChipType.missileAmmo, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.missileAmmo,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 5
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="🚀" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={20} step={5} />
  )
});

factories.set(MainChipType.random, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.random,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      greaterOrLess: 'greater',
      value: 1
    } as CheckChip),
  Chip: ({ chip }: ChipProps) => <CheckChip chip={chip as CheckChip} label="🎲" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <CheckChipEditor chip={chip as CheckChip} onChipUpdate={onChipUpdate} min={0} max={6} step={1} />
  )
});
factories.set(MainChipType.scanEnemy, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.scanEnemy,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      direction: 0,
      angle: 90,
      range: 100
    } as ScanChip),
  Chip: ({ chip }: ChipProps) => <ScanChip chip={chip as ScanChip} label="E" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <ScanChipEditor chip={chip as ScanChip} onChipUpdate={onChipUpdate} />
  )
});
factories.set(MainChipType.scanAttack, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.scanAttack,
      next: prev ? prev.next : Direction.down,
      branch: prev ? prev.branch || Direction.right : Direction.right,
      direction: 0,
      angle: 90,
      range: 100
    } as ScanChip),
  Chip: ({ chip }: ChipProps) => <ScanChip chip={chip as ScanChip} label="A" />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <ScanChipEditor chip={chip as ScanChip} onChipUpdate={onChipUpdate} />
  )
});

factories.set(MainChipType.fireLaser, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.fireLaser,
      next: prev ? prev.next : Direction.down,
      direction: 0,
      force: 100
    } as FireLaserChip),
  Chip: ({ chip }: ChipProps) => <FireLaserChip chip={chip as FireLaserChip} />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <FireLaserChipEditor chip={chip as FireLaserChip} onChipUpdate={onChipUpdate} />
  )
});

factories.set(MainChipType.fireMissile, {
  init: (prev?: Chip) => ({ type: MainChipType.fireMissile, next: prev ? prev.next : Direction.down }),
  Chip: ({}: ChipProps) => <FireMissileChip />,
  Editor: () => null
});

factories.set(MainChipType.log, {
  init: (prev?: Chip) => ({ type: MainChipType.log, next: prev ? prev.next : Direction.down }),
  Chip: ({ chip }: ChipProps) => <LogChip chip={chip as LogChip} />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <LogChipEditor chip={chip as LogChip} onChipUpdate={onChipUpdate} />
  )
});

factories.set(MainChipType.scanDebug, {
  init: (prev?: Chip) =>
    ({
      type: MainChipType.scanDebug,
      next: prev ? prev.next : Direction.down,
      direction: 0,
      angle: 90,
      range: 100
    } as ScanDebugChip),
  Chip: ({ chip }: ChipProps) => <ScanDebugChip chip={chip as ScanDebugChip} />,
  Editor: ({ chip, onChipUpdate }: ChipEditorProps) => (
    <ScanDebugChipEditor chip={chip as ScanDebugChip} onChipUpdate={onChipUpdate} />
  )
});

export function selectChipUi(chip: ChipType): ChipUiFactory {
  const factory = factories.get(chip);
  if (!factory) {
    throw new Error('Unknown chip');
  }
  return factory;
}
