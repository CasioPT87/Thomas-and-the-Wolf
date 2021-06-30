import { useEffect, useState } from 'react'


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

  return (
    <>
      <header>
        <h1>Thomas and The Wolf</h1>
      </header>
      <section>
        <div>hey, whatssupppp</div> 
      </section>
    </>
  )
} 

export default Grid;
