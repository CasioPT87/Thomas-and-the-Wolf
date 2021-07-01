import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import layoutData from '../../test/mockedData/layout';

import Grid from '../Grid/Grid';

describe.only('Box component', () => {

  beforeEach(() => {
    fetch = jest.fn().mockReturnValue(Promise.resolve({ ok: true, json: () => Promise.resolve(layoutData)}))
  })

  afterEach(() => {
    fetch.mockClear();
  });

  it('exist in the right amount', async() => {
    const { findAllByTestId } = render(<Grid />);
    expect(await findAllByTestId('box')).toHaveLength(layoutData.puzzles[0].layout.length)
  });
})