import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import layoutData from '../../test/mockedData/layout';

import Grid from './Grid';

describe.only('Grid component', () => {

  beforeEach(() => {
    fetch = jest.fn().mockReturnValue(Promise.resolve({ ok: true, json: () => Promise.resolve(layoutData)}))
  })

  afterEach(() => {
    fetch.mockClear();
  });

  it('renders and has right title', async() => {
    render(<Grid />);
    expect(await screen.findByText('Thomas and The Wolf')).toBeInTheDocument()
  });
})
