
export default function getNumberOfRowsAndColumns(data) {
  const layout = data.puzzles[0].layout; 
  const numRows = Math.max(...layout.map(boxData => boxData.row));
  const numColumns = Math.max(...layout.map(boxData => boxData.column));
  return {
    rows: numRows,
    cols: numColumns
  }
}