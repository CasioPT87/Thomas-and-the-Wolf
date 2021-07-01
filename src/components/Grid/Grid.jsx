import { useEffect, useState } from 'react';
import Box from '../Box/Box';
import dataFormatter from '../../helpers/dataFormatter';
import useAppManager from '../../hooks/useAppManager';
import calculateGrid from '../../helpers/calculateGrid';

const style = {
  gridTemplateColumns: 'repeat(0, auto)',
  gridTemplateRows: 'repeat(0, auto)',
  display: 'grid',
  width: '100%'
}

const Grid = () => {
  const { manager, moveTom, setInitialData } = useAppManager(null);
  const [updatedStyle, setStyles] = useState(style);
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(process.env.PUBLIC_URL + '/data/PuzzleSetups.json');
      if (!resp.ok) return;
      const data = await resp.json();
      setInitialData(dataFormatter(data));
      setGrid(calculateGrid(data));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!grid) return;
    const updatedStyles = {
      ...style,
      gridTemplateColumns: `repeat(${grid.cols}, auto)`,
      gridTemplateColumns: `repeat(${grid.rows}, auto)`
    }
    setStyles(updatedStyles);
  }, [grid]);

  if (!manager) return null;

  return (
    <>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <section style={updatedStyle}>
        {manager.data.layout.map(boxData => <Box key={boxData.id} data={boxData} onClick={moveTom} />)}
      </section>
    </>
  )
} 

export default Grid;
