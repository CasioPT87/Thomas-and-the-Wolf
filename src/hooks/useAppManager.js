import { useState } from "react";

const TURNS = ["Tom", "Wolf-1", "Wolf-2"];

export class MoveDecider {

  static wolfShouldMoveColumnOrRow(wolfBox, tomBox) {
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

  positionMoveType(targetBox, referenceBox) {
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
    return box1[comparison] === box2[comparison]
  }
}

export class AppManagerHelper {

  constructor(data, moveDecider) {
    this.data = data;
    this.turn = TURNS[0];
    this.tomBox = data.initialPosition.tom.id;
    this.wolfBox = data.initialPosition.wolf.id;
    this.moveDecider = moveDecider;
  }

  moveTom(boxId) {
    const targetBox = this.findBoxById(boxId);
    const referenceBox = this.findBoxById(this.getReferenceBox());
    const moveType = this.moveDecider.positionMoveType(targetBox, referenceBox);
    if (!moveType) return this;

    if (referenceBox.canMove(moveType)) return this.move(boxId);
    return null;
  }

  moveWolf() {
    const wolfBox = this.findBoxById(this.wolfBox);
    const tomBox = this.findBoxById(this.tomBox);
    const { change, qttyRow, qttyColumns, force } = MoveDecider.wolfShouldMoveColumnOrRow(wolfBox, tomBox);
    const targetBox = this.findWolfTarget(wolfBox, change, qttyRow, qttyColumns, force);

    if (targetBox) {
      return this.move(targetBox.id);
    }

    return this.nextTurn();
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

  isGameOver() {
    return this.tomBox === this.wolfBox;
  }

  isSuccessfulEscape() {
    const tomBox = this.findBoxById(this.tomBox);
    return tomBox.isExit;
  }

  isCurrentTomBox(boxId) {
    return boxId === this.tomBox;
  }

  isCurrentWolfBox(boxId) {
    return boxId === this.wolfBox;
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
      if (wolfCanMove) return targetBox;
      else return null;
    }
  }

  getWolfTargetData(coordinates, wolfBox) {
    const targetBox = this.findBoxByCoordinates(...coordinates);
    const referenceBox = this.findBoxById(this.getReferenceBox());
    const moveType = this.moveDecider.positionMoveType(targetBox, referenceBox);
    const wolfCanMove = wolfBox.canMove(moveType);
    return { targetBox, moveType, wolfCanMove }
  }
}

export default function useAppManager() {
  const [managerHelper, setManagerHelper] = useState(null);
  const [turn, setTurn] = useState(null);
  const [initialData, setInitialData] = useState(null);

  return {
    manager: managerHelper,
    moveTom: (boxId) => {
      const turn = managerHelper.moveTom(boxId);
      if (turn) setTurn(turn);
    },
    moveWolf: () => {
      const newTurn = managerHelper.moveWolf();
      if (newTurn) setTurn(newTurn);
    },
    setInitialData: (data) => {
      const manager = new AppManagerHelper(data, new MoveDecider());
      setManagerHelper(manager);
      setInitialData(data);
    },
    turn,
    initialData
  }
}

export { TURNS };