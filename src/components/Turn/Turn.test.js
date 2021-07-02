import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import layoutData from '../../test/mockedData/layout';
import { AppManagerHelper } from '../../hooks/useAppManager';
import dataFormatter from '../../helpers/dataFormatter';

import Turn from './Turn';

describe.only('Turn component', () => {

  let manager;

  beforeEach(() => {
    manager = new AppManagerHelper(dataFormatter(layoutData));
  })

  it('renders and display', () => {
    const { getByTestId } = render(<Turn manager={manager} />);
    expect(getByTestId('turn')).toBeInTheDocument()
  });

  it('renders Tom and The WOlf turn boards', () => {
    const { getByText } = render(<Turn manager={manager} />);
    const tomTurnBoard = getByText(/Tom's turn/);
    const wolfTurnBoard = getByText(/Wolf's turn/);
    expect(tomTurnBoard).toBeInTheDocument();
    expect(wolfTurnBoard).toBeInTheDocument();
  });

  it('boards change opacity when turn changes', async() => {
    const { rerender } = render(<Turn manager={manager} />);
    const tomTurnBoard = screen.getByText(/Tom's turn/);
    const wolfTurnBoard = screen.getByText(/Wolf's turn/);
    expect(tomTurnBoard).toHaveClass('selected');
    expect(wolfTurnBoard).not.toHaveClass('selected');
    manager.nextTurn();
    rerender(<Turn manager={manager} />);

    expect(tomTurnBoard).not.toHaveClass('selected');
    expect(wolfTurnBoard).toHaveClass('selected');
    
  });

  it('board takes two wolf turns', async() => {
    const { rerender } = render(<Turn manager={manager} />);
    const tomTurnBoard = screen.getByText(/Tom's turn/);
    const wolfTurnBoard = screen.getByText(/Wolf's turn/);
    manager.nextTurn();
    manager.nextTurn();
    rerender(<Turn manager={manager} />);

    expect(tomTurnBoard).not.toHaveClass('selected');
    expect(wolfTurnBoard).toHaveClass('selected');
    
  });

  it('board takes two wolf turns and then comes back to toms turn', async() => {
    const { rerender } = render(<Turn manager={manager} />);
    const tomTurnBoard = screen.getByText(/Tom's turn/);
    const wolfTurnBoard = screen.getByText(/Wolf's turn/);
    manager.nextTurn();
    manager.nextTurn();
    manager.nextTurn();
    rerender(<Turn manager={manager} />);

    expect(tomTurnBoard).toHaveClass('selected');
    expect(wolfTurnBoard).not.toHaveClass('selected');
    
  });
})