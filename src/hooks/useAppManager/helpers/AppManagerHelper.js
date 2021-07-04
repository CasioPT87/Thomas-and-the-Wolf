export default class DataManager {
    constructor(data) {
      this.data = data;
    }
  
    positionMoveType(targetBoxId, referenceBoxId) {
      const targetBox = this.findBoxById(targetBoxId);
      const referenceBox = this.findBoxById(referenceBoxId);
      if (!targetBox || !referenceBox) return null;
      if (this.inSame(targetBox, referenceBox, 'column')) {
        if (targetBox.row === referenceBox.row - 1) return 'up';
        if (targetBox.row === referenceBox.row + 1) return 'down';
  
      } else if (this.inSame(targetBox, referenceBox, 'row')) {
        if (targetBox.column === referenceBox.column + 1) return 'right';
        if (targetBox.column === referenceBox.column - 1) return 'left';
      }
      return null;
    }
  
    inSame(box1, box2, comparison) {
      return box1[comparison] === box2[comparison];
    }
  
    findBoxById(boxId) {
      return this.data.layout.find(box => box.id === boxId);
    }
  
    findBoxByCoordinates(row, column) {
      return this.data.layout.find(box => box.row === row && box.column === column);
    }
  
    canMove(boxId, position) {
      return this.findBoxById(boxId).canMove(position);
    }
  
    shouldWolfMoveColumnOrRow(wolfBoxId, tomBoxId) {
      const wolfBox = this.findBoxById(wolfBoxId);
      const tomBox = this.findBoxById(tomBoxId);
      const diffRows = wolfBox.row - tomBox.row;
      const diffColums = wolfBox.column - tomBox.column;
      const change = Math.abs(diffRows) < Math.abs(diffColums) ? 'column' : 'row';
      let force = false;
      if (diffRows === 0 || diffColums === 0) {
        force = true;
      }
      const qttyRow = diffRows > 0 ? -1 : 1;
      const qttyColumns = diffColums > 0 ? -1 : 1;
  
      return {
        change,
        qttyRow,
        qttyColumns,
        force
      }
    }
  
    getCoordinatesWolfTarget(shouldChangeRow, wolfBox, qttyRow, qttyColumns) {
      if (shouldChangeRow) return [wolfBox.row + qttyRow, wolfBox.column];
      else return [wolfBox.row, wolfBox.column + qttyColumns];
    }
  
    getWolfTargetBox(wolfBoxId, shouldChangeRow, qttyRow, qttyColumns, force, isSecondTry) {
      const wolfBox = this.findBoxById(wolfBoxId);
      const targetCoordinates = this.getCoordinatesWolfTarget(shouldChangeRow, wolfBox, qttyRow, qttyColumns);
      const targetBox = this.findBoxByCoordinates(...targetCoordinates);
      const moveType = this.positionMoveType(targetBox.id, wolfBoxId);
      const wolfCanMove = wolfBox.canMove(moveType);
      if (wolfCanMove) return targetBox.id;
      else if (!force && !isSecondTry) return this.getWolfTargetBox(wolfBoxId, !shouldChangeRow, qttyRow, qttyColumns, force, true);
      return null;
    }
  }