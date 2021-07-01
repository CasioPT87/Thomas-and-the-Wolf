import { useEffect, useState } from 'react';
import Box from '../Box/Box';


const Grid = () => {
  const [data, setData] = useState(null);

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

  const layoutData = data.puzzles[0].layout;

  return (
    <>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <section>
        {layoutData.map(boxData => <Box data={boxData} />)}
      </section>
    </>
  )
} 

export default Grid;
