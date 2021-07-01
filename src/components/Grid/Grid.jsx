import { useEffect, useState } from 'react';
import Box from '../Box/Box';
import dataFormatter from '../../helpers/dataFormatter';
import useAppManager from '../../hooks/useAppManager';


const Grid = () => {
  const { manager, moveTom, setInitialData } = useAppManager(null);

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(process.env.PUBLIC_URL + '/data/PuzzleSetups.json');
      if (!resp.ok) return;
      const data = await resp.json();
      setInitialData(dataFormatter(data));
    }
    fetchData();
  }, []);

  if (!manager) return null;

  return (
    <>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <section>
        {manager.data.layout.map(boxData => <Box key={boxData.id} data={boxData} onClick={moveTom} />)}
      </section>
    </>
  )
} 

export default Grid;
