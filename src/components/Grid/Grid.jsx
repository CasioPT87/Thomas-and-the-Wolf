import { useEffect, useState } from 'react';
import Box from '../Box/Box';
import useAppState from '../../hooks/useAppState';


const Grid = () => {
  const { data, setData } = useAppState(null);

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(process.env.PUBLIC_URL + '/data/PuzzleSetups.json');
      if (!resp.ok) return;
      const data = await resp.json();
      setData(data);
    }
    fetchData();
  }, []);

  if (!data) return null;

  return (
    <>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <section>
        {data.map(boxData => <Box key={boxData.id} data={boxData} />)}
      </section>
    </>
  )
} 

export default Grid;
