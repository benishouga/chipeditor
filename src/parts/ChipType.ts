import { stringToEnum } from './stringToEnum';

export const [MainChipType, MainChipTypeValues] = stringToEnum([
  'nop',
  'random',
  'frame',
  'altitude',
  'wait',
  'shield',
  'temperature',
  'missileAmmo',
  'scanEnemy',
  'scanAttack',
  'ahead',
  'back',
  'ascent',
  'descent',
  'turn',
  'fireLaser',
  'fireMissile',
  'fuel',
  'log',
  'scanDebug'
]);
export type MainChipType = keyof typeof MainChipType;

export const [MissileChipType, MissileChipTypeValues] = stringToEnum([
  'nop',
  'random',
  'frame',
  'altitude',
  'wait',
  'direction',
  'scanEnemy',
  'speedUp',
  'speedDown',
  'turnRight',
  'turnLeft',
  'fuel'
]);
export type MissileChipType = keyof typeof MissileChipType;

export type ChipType = MainChipType | MissileChipType;
