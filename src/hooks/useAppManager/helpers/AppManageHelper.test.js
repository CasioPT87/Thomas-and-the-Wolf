import layoutData from '../../../test/mockedData/layout';
import { AppManager } from '../useAppManager';
import DataManager from '../helpers/AppManagerHelper';
import dataFormatter from '../../../helpers/dataFormatter';

jest.mock('../helpers/AppManagerHelper');

describe('AppManagerHelper', () => {

  test('AppManager constructor creates a new instance of DataManager', () => {
    const formattedData = dataFormatter(layoutData);
    new AppManager(formattedData);
    expect(DataManager).toHaveBeenCalledTimes(1);
  });
})