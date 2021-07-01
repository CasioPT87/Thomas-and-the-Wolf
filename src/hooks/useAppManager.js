import { useEffect, useState } from "react";

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

  moveWolf() {}

  move(boxId) {
    if (this.isTomTurn()) {
      this.tomBox = boxId;
      return this.nextTurn();
    } else {
      this.wolfBox = boxId;
      return this.nextTurn();
    }
  }

  nextTurn() {
    return this;
  }

  positionMoveType(boxId) {
    const targetBox = this.findBoxById(boxId);
    const referenceBox = this.findBoxById(this.getReferenceBox());
    if (!targetBox || !referenceBox) return null;
    if (this.inSame(targetBox, referenceBox, 'column')) {
      if (targetBox.row === referenceBox.row + 1) return 'up';
      if (targetBox.row === referenceBox.row - 1) return 'down';

    } else if (this.inSame(targetBox, referenceBox, 'row')) {
      if (targetBox.column === referenceBox.column + 1) return 'right';
      if (targetBox.column === referenceBox.column - 1) return 'left';

    }
    return null;
  }

  findBoxById(boxId) {
    return this.data.layout.find(box => box.id === boxId);
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
}

export default function useAppManager(initialdata) {
  const [managerHelper, setManagerHelper] = useState(null);

  return {
    manager: managerHelper,
    moveTom: (boxId) => {
      const manager = managerHelper.moveTom(boxId);
      setManagerHelper(manager);
    },
    setInitialData: (data) => {
      setManagerHelper(new AppManagerHelper(data));
    },
  }
}