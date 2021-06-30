import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Grid from './index';

test('renders and has right title', () => {
  render(<Grid />);
  screen.findByText('Thomas and The Wolf')
  .then(h1 => {
    expect(h1).toBeInTheDocument();
  })
  .catch(e => {
    throw new Error('title not found');
  })
});