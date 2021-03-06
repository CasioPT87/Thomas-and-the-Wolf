import { useEffect, useState } from 'react';
import Box from '../Box/Box';
import Turn from '../Turn/Turn';
import dataFormatter from '../../helpers/dataFormatter';
import useAppManager from '../../hooks/useAppManager/useAppManager';
import { getNumberOfRowsAndColumns as calculateGrid } from '../../helpers/gridFunctions';
import styles from './Grid.module.css';

const STEP_DELAY = 500;

const Grid = () => {
  const { initialData, manager, moveTom, moveWolf, setInitialData, turn } = useAppManager();
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!grid) return;
    const updatedStyles = {
      gridTemplateColumns: `repeat(${grid.cols}, 80px)`,
      gridTemplateRows: `repeat(${grid.rows}, 80px)`
    }
    setStyles(updatedStyles);
  }, [grid]);

  useEffect(() => {
    let moveWolfTimer;
    let restartTimer;
    if (!manager) return;
    if (!manager.isTomTurn()) {
      moveWolfTimer = setTimeout(() => moveWolf(), STEP_DELAY);
    }
    function hasFinished() {
      if (manager.isGameOver()) {
        end('thats all folks!!')
      }

      if (manager.isSuccessfulEscape()) {
        end('well done!! congratulations!!')
      }
    }
    function end(message) {
      restartTimer = setTimeout(() => {
        alert(message);
        setInitialData(initialData);
      }, STEP_DELAY);
    }
    hasFinished();
    return function clearTimers() {
      clearTimeout(moveWolfTimer);
      clearTimeout(restartTimer);
    }
  }, [turn, manager, initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!manager) return null;

  return (
    <div className={styles.wrap}>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <Turn manager={manager} />
      <section className={styles.grid} style={updatedStyle}>
        {manager.dataManager.data.layout.map(boxData => {
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
