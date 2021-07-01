
function canMove(direction, border) {
  const directions = { up: 'T', down: 'B', left: 'L', right: 'R' };
  console.log(Object.keys(directions), direction)
  if (!Object.keys(directions).includes(direction)) return false;
  return !border.includes(directions[direction]);
}

function findIdByPosition(boxesData, position) {
  return boxesData.find(boxData => {
    return boxData.column === position.column && boxData.row === position.row;
  })
}

export default function dataFormatter(data) {
  const layout = data.puzzles[0].layout;

  const boxesData = layout.map((boxData, i) => {
    const { row, column, borders } = boxData;
    return {
      index: i,
      id: `box-${i}`,
      row,
      column,
      canMove: (direction) => canMove(direction, borders),
    }
  });

  return {
    initialPosition: {
      tom: findIdByPosition(boxesData, data.puzzles[0].thomas),
      wolf: findIdByPosition(boxesData, data.puzzles[0].wolf)
    },
    layout: boxesData
  }
}