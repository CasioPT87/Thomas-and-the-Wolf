import { useEffect, useState } from 'react';
import Box from '../Box/Box';
import Turn from '../Turn/Turn';
import dataFormatter from '../../helpers/dataFormatter';
import useAppManager from '../../hooks/useAppManager';
import calculateGrid from '../../helpers/calculateGrid';
import styles from './Grid.module.css';

const STEP_DELAY = 500;

const Grid = () => {
  const { initialData, manager, moveTom, moveWolf, setInitialData, turn } = useAppManager(null);
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
    let moveWolfTimer;
    let restartTimer;
    if (!grid || !manager) return;
    if (!manager.isTomTurn()) {
      moveWolfTimer = setTimeout(() => moveWolf(), STEP_DELAY);
    }
    if (manager.isGameOver()) {
      restartTimer = setTimeout(() => {
        alert('that is all folks');
        setInitialData(initialData);
      }, STEP_DELAY);
    }
    return function clearTimers() {
      clearTimeout(moveWolfTimer);
      clearTimeout(restartTimer);
    }
  }, [turn, manager]);

  if (!manager) return null;

  return (
    <div className={styles.wrap}>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <Turn manager={manager} />
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
    </div>
  )
} 

export default Grid;
