import { useState } from "react";
import DataManager from "./helpers/AppManagerHelper";

const TURNS = ["Tom", "Wolf-1", "Wolf-2"];

export class AppManager {

  constructor(data) {
    this.turn = TURNS[0];
    this.tomBox = data.initialPosition.tom.id;
    this.wolfBox = data.initialPosition.wolf.id;
    this.dataManager = new DataManager(data);
  }

  moveTom(boxId) {
    const moveType = this.dataManager.positionMoveType(boxId, this.getReferenceBox());
    if (!moveType) return null;

    if (this.dataManager.canMove(this.getReferenceBox(), moveType)) {
      return this.move(boxId);
    }
    return null;
  }

  moveWolf() {
    const { change, qttyRow, qttyColumns, force } = this.dataManager.shouldWolfMoveColumnOrRow(this.wolfBox, this.tomBox);
    const shouldChangeRow = change === 'row';
    const targetBoxId = this.dataManager.getWolfTargetBox(this.wolfBox, shouldChangeRow, qttyRow, qttyColumns, force, false);

    if (targetBoxId) {
      return this.move(targetBoxId);
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
    const tomBox = this.dataManager.findBoxById(this.tomBox);
    return tomBox.isExit;
  }

  isCurrentTomBox(boxId) {
    return boxId === this.tomBox;
  }

  isCurrentWolfBox(boxId) {
    return boxId === this.wolfBox;
  }
}

export default function useAppManager() {
  const [manager, setManagerHelper] = useState(null);
  const [turn, setTurn] = useState(null);
  const [initialData, setInitialData] = useState(null);

  return {
    manager,
    moveTom: (boxId) => {
      const turn = manager.moveTom(boxId);
      if (turn) setTurn(turn);
    },
    moveWolf: () => {
      const turn = manager.moveWolf();
      if (turn) setTurn(turn);
    },
    setInitialData: (data) => {
      const manager = new AppManager(data);
      setManagerHelper(manager);
      setInitialData(data);
    },
    turn,
    initialData
  }
}

export { TURNS };