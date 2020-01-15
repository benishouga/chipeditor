import { stringToEnum } from "./stringToEnum";

export const [Direction, DirectionValues] = stringToEnum([
  'up',
  'down',
  'left',
  'right',
  'upleft',
  'upright',
  'downleft',
  'downright'
]);
export type Direction = keyof typeof Direction;

