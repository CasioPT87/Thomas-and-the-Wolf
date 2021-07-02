import { render, waitFor } from '@testing-library/react';
import App from './App';

test('renders and contains title', async() => {
  const { findByTestId } = render(<App />);
  expect(await findByTestId('main-app')).toBeInTheDocument()
});
