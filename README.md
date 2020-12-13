# chipeditor
Chip editor like Carnage Heart.

I wanna be able to use it in Sourcer as follows.

```js
module.exports = () => {
  // -------

  const program = {
    main: [
      [{ type: 'nop', next: 'down' }, { type: 'nop', next: 'right' }],
      [{ type: 'nop', next: 'right' }, { type: 'nop', next: 'up' }]
    ]
  };

  // -------

  const mainInstructionSet = {
    nop: (_ctrl, _chip) => {}
  };

  const run = (program, isa) => {
    let current = { x: 0, y: 0 };
    return contoller => {
      console.log(current);

      const line = program[current.y];
      const chip = line[current.x];
      if (!chip) return;
      const next = isa[chip.type](contoller, chip) ? chip.branch || chip.next : chip.next;
      current.x += next.includes('left') ? -1 : next.includes('right') ? 1 : 0;
      current.y += next.includes('up') ? -1 : next.includes('down') ? 1 : 0;
      if (current.x < 0 || line.length <= current.x || current.y < 0 || program.length <= current.y) {
        current = { x: 0, y: 0 };
      }
    };
  };
  return run(program.main, mainInstructionSet);
};
```
