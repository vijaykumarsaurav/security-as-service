import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

const columnsList = [
  {
    field: 'id',
    numeric: false,
    width: 80,
    sortable: true,
    editable: true,
    headerName: 'Sr.',
  },
  {
    field: 'name',
    numeric: true,
    minWidth: 300,
    maxWidth: 500,

    sortable: true,
    editable: true,
    headerName: 'Name',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip placement="bottom" title={currentRow?.name}>
      <span> {currentRow?.name}</span>
    </Tooltip>
    }
  },
];

const hostColumnsList = [
  {
    field: 'hostname',
    numeric: true,
    minWidth: 300,
    maxWidth: 500,
    sortable: true,
    editable: true,
    headerName: 'Hostname',
    valueGetter: (params) =>
    `${params.row?.hostname || ''}`,
  },
  {
    field: 'ip',
    numeric: false,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'IP',
  }
  
];
export default function DataTable( { rows, loader, title}) {

  let column = title === 'Hostnames' ? hostColumnsList : columnsList; 
  console.log('column',column)
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={title === 'Hostnames' ? hostColumnsList : columnsList}
        pageSize={5}
        loading={loader}
        rowsPerPageOptions={[5]}
        //checkboxSelection
      />
    </div>
  );
}
