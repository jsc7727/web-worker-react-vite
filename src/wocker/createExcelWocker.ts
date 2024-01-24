import { utils, write } from 'xlsx';




type ExcelType = {
  id: {
    bioguide: string;
    govtrack: number;
    icpsr_prez: number;
  };
  name: { first: string; last: string };
  bio: {
    birthday: string;
    gender: string;
  };
  terms: {
    type: string;
    start: string;
    end: string;
    party: string;
    how: string;
  }[];
  start?: string;
};

self.onmessage = async (e) => {
  console.log(e);
  const url = e?.data?.url;
  // const { utils, write } = getXlsx();
  if (url) {
    const raw_data: ExcelType[] = await (await fetch(url)).json();
    /* filter for the Presidents */
    const prez = raw_data.filter((row) =>
      row.terms.some((term) => term.type === 'prez')
    );

    /* sort by first presidential term */

    prez.forEach((row) => {
      row.start = row.terms.find((term) => term.type === 'prez')?.start;
    });
    // prez.sort((l, r) => l.start.localeCompare(r.start));

    /* flatten objects */
    const rows = prez.map((row) => ({
      name: row.name.first + ' ' + row.name.last,
      birthday: row.bio.birthday,
    }));

    /* generate worksheet and workbook */
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Dates');

    /* fix headers */
    utils.sheet_add_aoa(worksheet, [['Name', 'Birthday']], {
      origin: 'A1',
    });

    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet['!cols'] = [{ wch: max_width }];

    /* create an XLSX file and try to save to Presidents.xlsx */
    // writeFile(workbook, 'Presidents.xlsx', { compression: true });

    const u8: Uint8Array = write(workbook, { type: 'array', bookType: 'xlsx' });
    postMessage({ t: 'export', v: u8 });
  }
};
