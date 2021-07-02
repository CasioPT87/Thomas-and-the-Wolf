
export function getNumberOfRowsAndColumns(data) {
  const layout = data.puzzles[0].layout; 
  const numRows = Math.max(...layout.map(boxData => boxData.row));
  const numColumns = Math.max(...layout.map(boxData => boxData.column));
  return {
    rows: numRows,
    cols: numColumns
  }
}

export function findExitBox(numRows, numColumns, canMove, borders, row, column) {
  let firstRowCanMoveUp, lastRowCanMoveDown, firstColumnCanMoveLeft, lastColumnCanMoveRight;
  const isFirstRow = row === 1;
  const isLastRow = row === numRows;
  const isFirstColumn = column === 1;
  const isLastColumn = column === numColumns;
  const dangerZone = [
    isFirstRow,
    isLastRow,
    isFirstColumn,
    isLastColumn
  ].some(zone => !!zone);

  if (!dangerZone) return false;

  if (isFirstRow) firstRowCanMoveUp = canMove('up', borders);
  if (isLastRow) lastRowCanMoveDown = canMove('down', borders);
  if (isFirstColumn) firstColumnCanMoveLeft = canMove('left', borders);
  if (isLastColumn) lastColumnCanMoveRight = canMove('right', borders);

  const isExit = [
    firstRowCanMoveUp,
    lastRowCanMoveDown,
    firstColumnCanMoveLeft,
    lastColumnCanMoveRight
  ].some(canMove => !!canMove);

  return isExit;

}
