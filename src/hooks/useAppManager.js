import { useState } from "react";

const TURNS = ["Tom", "Wolf-1", "Wolf-2"];

class AppManagerHelper {

  constructor(data) {
    this.data = data;
    this.turn = TURNS[0];
    this.tomBox = data.initialPosition.tom.id;
    this.wolfBox = data.initialPosition.wolf.id;
  }

  moveTom(boxId) {
    const moveType = this.positionMoveType(boxId);
    if (!moveType) return this;

    const referenceBox = this.findBoxById(this.getReferenceBox());
    if (referenceBox.canMove(moveType)) return this.move(boxId);
    return null;
  }

  moveWolf() {
    const wolfBox = this.findBoxById(this.wolfBox);
    const tomBox = this.findBoxById(this.tomBox);
    const { change, qttyRow, qttyColumns, force } = this.wolfShouldMoveColumnOrRow(wolfBox, tomBox);
    const targetBox = this.findWolfTarget(wolfBox, change, qttyRow, qttyColumns, force);

    if (targetBox) {
      return this.move(targetBox.id);
    }

    return this.nextTurn();
  }

  wolfShouldMoveColumnOrRow(wolfBox, tomBox) {
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

  findWolfTarget(wolfBox, change, qttyRow, qttyColumns, force) {
    let coordinates;
    if (change === 'row') coordinates = [wolfBox.row + qttyRow, wolfBox.column];
    else coordinates = [wolfBox.row, wolfBox.column + qttyColumns];

    const { targetBox, wolfCanMove } = this.getWolfTargetData(coordinates, wolfBox);
    if(wolfCanMove) return targetBox;
    if(wolfCanMove && force) return null;
    else if(!wolfCanMove && !force) {
      if (change === 'row') coordinates = [wolfBox.row, wolfBox.column + qttyColumns];
      else coordinates = [wolfBox.row + qttyRow, wolfBox.column];

      const { targetBox, wolfCanMove } = this.getWolfTargetData(coordinates, wolfBox);
      if(wolfCanMove) return targetBox;
      else return null;
    }
  }

  getWolfTargetData(coordinates, wolfBox) {
    const targetBox = this.findBoxByCoordinates(...coordinates);
    const moveType = this.positionMoveType(targetBox.id);
    const wolfCanMove = wolfBox.canMove(moveType);
    return { targetBox, moveType, wolfCanMove }
  }

  move(boxId) {
    if (this.isTomTurn()) {
      this.tomBox = boxId;
    } else {
      this.wolfBox = boxId;
    }
    return this.nextTurn();
  }

  nextTurn() {
    let turnIndex = TURNS.findIndex(turn => turn === this.turn);
    turnIndex++
    if (turnIndex >= TURNS.length) turnIndex = 0;
    this.turn = TURNS[turnIndex];
    return this.turn;
  }

  positionMoveType(boxId) {
    const targetBox = this.findBoxById(boxId);
    const referenceBox = this.findBoxById(this.getReferenceBox());
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

  findBoxById(boxId) {
    return this.data.layout.find(box => box.id === boxId);
  }

  findBoxByCoordinates(row, column) {
    return this.data.layout.find(box => box.row === row && box.column === column);
  }

  getReferenceBox() {
    if (this.isTomTurn()) return this.tomBox;
    return this.wolfBox;
  }

  isTomTurn() {
    return this.turn === TURNS[0];
  }

  inSame(box1, box2, comparison) {
    return box1[comparison] === box2[comparison]
  }

  isCurrentTomBox(boxId) {
    return boxId === this.tomBox;
  }

  isCurrentWolfBox(boxId) {
    return boxId === this.wolfBox;
  }
}

export default function useAppManager() {
  const [managerHelper, setManagerHelper] = useState(null);
  const [turn, setTurn] = useState(null);

  return {
    manager: managerHelper,
    moveTom: (boxId) => {
      const turn = managerHelper.moveTom(boxId);
      if (turn) setTurn(turn);
    },
    moveWolf: (turn) => {
      const newTurn = managerHelper.moveWolf(turn);
      if (newTurn) setTurn(newTurn);
    },
    setInitialData: (data) => {
      const manager = new AppManagerHelper(data);
      setManagerHelper(manager);
    },
    turn 
  }
}