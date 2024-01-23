import { useEffect, useMemo } from 'react';
import './App.css';
import { Button } from '@mantine/core';

function App() {
  console.log(new URL('./wocker/createExcelWocker.ts', import.meta.url));
  const createExcel: Worker = useMemo(
    () => new Worker(new URL('./wocker/createExcelWocker.ts', import.meta.url)),
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
    // createExcel.onmessage = (e: MessageEvent<{ message: string }>) => {
    //   console.log('app 잘 받음', e?.data?.message);
    // };

    createExcel.addEventListener('message', function (e) {
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
    });
    return () => {};
  }, [createExcel]);

  createExcel.addEventListener('message', function (e) {
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
  });

  return (
    <>
      <Button onClick={handleCreateSheet}>asdf</Button>
    </>
  );
}

export default App;
