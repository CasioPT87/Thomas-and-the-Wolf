import { useEffect, useState } from 'react';
import Box from '../Box/Box';
import dataFormatter from '../../helpers/dataFormatter';
import useAppManager from '../../hooks/useAppManager';
import calculateGrid from '../../helpers/calculateGrid';
import styles from './Grid.module.css';

const STEP_DELAY = 500;

const Grid = () => {
  const { manager, moveTom, moveWolf, setInitialData, turn } = useAppManager(null);
  const [updatedStyle, setStyles] = useState({});
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
      gridTemplateColumns: `repeat(${grid.cols}, 80px)`,
      gridTemplateColumns: `repeat(${grid.rows}, 80px)`
    }
    setStyles(updatedStyles);
  }, [grid]);

  useEffect(() => {
    if (!grid || !manager) return;
    if (!manager.isTomTurn()) {
      var moveWolfTimer = setTimeout(() => moveWolf(turn), STEP_DELAY);
    }
    return (() => {
      clearInterval(moveWolfTimer);
    })
  }, [turn]);

  if (!manager) return null;

  return (
    <>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <section className={styles.grid} style={updatedStyle}>
        {manager.data.layout.map(boxData => {
          return (
            <Box
              key={boxData.id}
              data={boxData}
              onClick={moveTom}
              manager={manager}
            />)
        })}
      </section>
    </>
  )
} 

export default Grid;
