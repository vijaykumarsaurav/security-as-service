import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

const columnsList = [
  // {
  //   field: 'id',
  //   numeric: false,
  //   width: 80,
  //   sortable: true,
  //   editable: true,
  //   headerName: 'Sr.',
  // },
  {
    field: 'message',
    numeric: true,
    minWidth: 400,
    maxWidth: 500,

    sortable: true,
    editable: true,
    headerName: 'Name',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip placement="bottom" title={currentRow?.message}>
      <span> {currentRow?.message}</span>
    </Tooltip>
    }
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
