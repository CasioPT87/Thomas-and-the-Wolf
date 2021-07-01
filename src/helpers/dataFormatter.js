
function canMove(direction, border) {
  const directions = { up: 'T', down: 'B', left: 'L', right: 'R' };
  if (!Object.keys(directions).contains(direction)) return false;
  return border.includes(directions[direction]);
}

export default function dataFormatter(data) {
  const layout = data.puzzles[0].layout;

  return layout.map((boxData, i) => {
    const { row, column, borders } = boxData;
    return {
      index: i,
      id: `box-${i}`,
      row,
      column,
      canMove: (direction) => canMove(direction, borders),
    }
  })
}