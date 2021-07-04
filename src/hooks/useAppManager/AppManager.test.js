import layoutData from '../../test/mockedData/layout';
import { AppManager, TURNS } from './useAppManager';
import DataManager from './helpers/AppManagerHelper';
import dataFormatter from '../../helpers/dataFormatter';

describe('AppManagerHelper', () => {

    let formattedData;
    let manager;

    beforeEach(() => {
      formattedData = dataFormatter(layoutData);
      manager = new AppManager(formattedData);
    });
  
    it('to have constructor properties', () => {
      expect(JSON.stringify(manager.dataManager.data)).toBe(JSON.stringify(formattedData));
      expect(manager.turn).toBe(TURNS[0]);
      expect(manager.tomBox).toBe(formattedData.initialPosition.tom.id);
      expect(manager.wolfBox).toBe(formattedData.initialPosition.wolf.id);
    });

    it('only allows tom to move to allowed boxes', () => {
      const boxes = formattedData.layout;
      const tomBoxId = formattedData.initialPosition.tom.id;
      const tomBox = manager.dataManager.findBoxById(tomBoxId);
      boxes.forEach(targetBox => {
        if (targetBox.id === tomBoxId) return;
        const direction = manager.dataManager.positionMoveType(targetBox.id, tomBox.id);
        const shouldBeAllowed = direction && tomBox.canMove(direction);        
        manager.moveTom(targetBox.id);
        if (shouldBeAllowed) expect(manager.tomBox).toBe(targetBox.id);
        else expect(manager.tomBox).not.toBe(targetBox.id);
        manager.tomBox = tomBoxId;
        manager.turn = TURNS[0];
        });
    });
  })