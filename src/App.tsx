import React, { useEffect, useState } from 'react';
import { precalcData } from './helpers';
import './App.css';

const App = () => {

  const [records, setRecords] = useState<any>(null)

  const normalizeResponse = (response: string) => 
    response.split('\n').map(record => 
        record.length ? JSON.parse(record.replaceAll("'", '"')) : null
      )

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/alexgavrushenko/lootbox/master/generated.log")
      .then(r => r.text())
      .then(text => {
        setRecords(precalcData(normalizeResponse(text).slice(0, 1000)))
      })
  }, [])

  return (
    <div className="App">
      <ul className="List">
        {/* {records && records.map((record, idx) => <li key={idx}>{record?.name}</li>)} */}
      </ul>
    </div>
  );
}

export default App;
