export function stringToEnum<T extends string>(o: T[]): [{ [K in T]: K }, T[]] {
  return [
    o.reduce((a, c) => {
      a[c] = c;
      return a;
    }, Object.create(null)),
    o
  ];
}
