import { getNumberOfRowsAndColumns, findExitBox } from './gridFunctions';


function canMove(direction, border) {
  const directions = { up: 'T', down: 'B', left: 'L', right: 'R' };
  if (!Object.keys(directions).includes(direction)) return false;
  return !border.includes(directions[direction]);
};

function findIdByPosition(boxesData, position) {
  return boxesData.find(boxData => {
    return boxData.column === position.column && boxData.row === position.row;
  });
};

export default function dataFormatter(data) {
  const layout = data.puzzles[0].layout;
  const { rows: numRows, cols: numColumns } = getNumberOfRowsAndColumns(data);

  const boxesData = layout.map((boxData, i) => {
    const { row, column, borders } = boxData;
    return {
      index: i,
      id: `box-${i}`,
      row,
      column,
      canMove: (direction) => canMove(direction, borders),
      isExit: findExitBox(numRows, numColumns, canMove, borders, row, column)
    }
  });

  return {
    initialPosition: {
      tom: findIdByPosition(boxesData, data.puzzles[0].thomas),
      wolf: findIdByPosition(boxesData, data.puzzles[0].wolf)
    },
    layout: boxesData,
    displayWall: canMove
  }
};