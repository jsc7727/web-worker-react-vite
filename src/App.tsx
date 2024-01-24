import { useEffect, useMemo } from 'react';
import './App.css';
import { Button } from '@mantine/core';
import Wocker from './wocker/createExcelWocker?worker'


function App() {
  const createExcel: Worker = useMemo(
    () => new Wocker(),
    []
  );

  const handleCreateSheet = () => {
    if (window.Worker) {
      createExcel.postMessage({
        url: 'https://sheetjs.com/data/executive.json',
      });
    }
    return;
  };


  
  

  useEffect(() => {

    const downloadExcel =(e)=> {
      if (e && e.data && e.data.t == 'export') {
        e.stopPropagation();
        e.preventDefault();
        // data will be the Uint8Array from the worker
        const data = e.data.v;

        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'SheetJSXPort.xlsx';
        a.href = url;
        document.body.appendChild(a);
        a.click();
      }
    }
    createExcel.addEventListener('message', downloadExcel);
    return () => {
      createExcel.removeEventListener('message',downloadExcel)
    };
  }, [createExcel]);

  return (
    <>
      <Button onClick={handleCreateSheet}>asdf</Button>
    </>
  );
}

export default App;
