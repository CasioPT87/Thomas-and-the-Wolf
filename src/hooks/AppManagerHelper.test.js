import layoutData from '../test/mockedData/layout';
import { AppManagerHelper, TURNS } from './useAppManager';
import dataFormatter from '../helpers/dataFormatter';

describe('AppManagerHelper', () => {

    let formattedData;
    let manager;

    beforeEach(() => {
      formattedData = dataFormatter(layoutData);
      manager = new AppManagerHelper(formattedData);
    })
  
    it('to have constructor properties', () => {
      expect(JSON.stringify(manager.data)).toBe(JSON.stringify(formattedData));
      expect(manager.turn).toBe(TURNS[0]);
      expect(manager.tomBox).toBe(formattedData.initialPosition.tom.id);
      expect(manager.wolfBox).toBe(formattedData.initialPosition.wolf.id);
    });

    it('only allows tom to move to allowed boxes', () => {
      const boxes = formattedData.layout;
      const tomBoxId = formattedData.initialPosition.tom.id;
      const tomBox = manager.findBoxById(tomBoxId);
      boxes.forEach(box => {
        if (box.id === tomBoxId) return;
        const direction = manager.positionMoveType(box.id);
        const shouldBeAllowed = direction && tomBox.canMove(direction);        
        manager.moveTom(box.id);
        if (shouldBeAllowed) expect(manager.tomBox).toBe(box.id);
        else expect(manager.tomBox).not.toBe(box.id);
        manager.tomBox = tomBoxId;
        manager.turn = TURNS[0];
        });
    });
  })