
import { useEffect, useState } from 'react';
import dataFormatter from '../helpers/dataFormatter';

const STATES = ["Tom", "Wolf"];

export default function useAppState() {
  const [formattedData, setFormattedData] = useState(null);

  return {
    data: formattedData,
    setData: (data) => {
      const formattedData = dataFormatter(data);
      return setFormattedData(formattedData);
    }
  }
}