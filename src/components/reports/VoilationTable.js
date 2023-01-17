import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

const columnsList = [
  {
    field: 'hostname',
    numeric: true,
    minWidth: 100,
    maxWidth: 200,

    sortable: true,
    editable: true,
    headerName: 'Hostname',
 
  },
  {
    field: 'violation',
    numeric: true,
    width: 180,
    sortable: true,
    editable: true,
    headerName: 'violation',
    valueGetter: (params) =>
      `${params.violation.message || ''}`,
  
  },
];

export default function DataTable( { rows, loader, setSelectionModel}) {
  console.log('columnsList',columnsList)
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columnsList}
        checkboxSelection
        pageSize={10}
        loading={loader}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
      />
    </div>
  );
}
