import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid';

import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService';
import ItemsDialog from './ItemsDialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select, Button, Typography, Paper } from '@mui/material';
import MergetoHCcycles from './MergetoHCcycles';
import Notify from '../utils/Notify';
import HCcyclesSelect from './HCcyclesSelect';
import ScanDateSelect from './ScanDateSelect';
import PolicySelect from './PolicySelect';
import moment from 'moment';
import Tooltip from '@mui/material/Tooltip';

const headCells = [
  {
    field: 'type',
    numeric: false,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Type',
  },
  {
    field: 'risk',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Risk',
  },
  {
    field: 'short_description',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Short Description',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.short_description}>
      <span> {currentRow?.short_description}</span>
    </Tooltip>
    }
  },
  {
    field: 'reason_for_change',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Reason For Change',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.reason_for_change}>
      <span> {currentRow?.reason_for_change}</span>
    </Tooltip>
    }
  },

  {
    field: 'assignment_group',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Assignment Group',
  },
  {
    field: 'correlation_display',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Correlation Display',
  },
  // {
  //   field: 'patterns',
  //   width: 150,
  //   sortable: true,
  //   editable: true,
  //   headerName: 'Patterns',
  //   renderCell: (param) => {
  //     const currentRow = param.row;
  //     return <Button onClick={() => alert(JSON.stringify(currentRow?.patterns))}> {currentRow?.patterns?.length} Patterns</Button>
  //   }
  // },
  {
    field: 'violations',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Violations',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Button onClick={() => alert(JSON.stringify(currentRow?.violations))}> {currentRow?.violations?.length} Violations</Button>
    }
  }
];

export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState(

    [
      {
        "id": 0,
        "type": "string",
        "risk": "string",
        "description": "string",
        "short_description": "string",
        "reason_for_change": "string",
        "assignment_group": "string",
        "correlation_display": "string",
        "violations": [
          {
            "message": "string",
            "suppression": "string",
            "id": 0,
            "change_ticket": "string"
          }
        ],
        "patterns": [
          {
            "id": 0,
            "pattern": "string",
            "priority": 0,
            "section": "string",
            "policy": "string",
            "exclude": true,
            "remediationExclude": true,
            "active": true,
            "nonComplianceRegex": {
              "regex": "string",
              "description": "string"
            },
            "policyParameters": [
              {
                "name": "string",
                "type": "string",
                "value": "string"
              }
            ]
          }
        ]
      },
      {
        "id": 0,
        "type": "string",
        "risk": "string",
        "description": "string",
        "short_description": "string",
        "reason_for_change": "string",
        "assignment_group": "string",
        "correlation_display": "string",
        "violations": [
          {
            "message": "string",
            "suppression": "string",
            "id": 0,
            "change_ticket": "string"
          }
        ],
        "patterns": [
          {
            "id": 0,
            "pattern": "string",
            "priority": 0,
            "section": "string",
            "policy": "string",
            "exclude": true,
            "remediationExclude": true,
            "active": true,
            "nonComplianceRegex": {
              "regex": "string",
              "description": "string"
            },
            "policyParameters": [
              {
                "name": "string",
                "type": "string",
                "value": "string"
              }
            ]
          }
        ]
      }
    ]);
  const [hccycleName, setHccycleName] = React.useState('');
  const [policies, setPolicies] = React.useState([]);
  const [policyName, setPolicyName] = React.useState('');
  const [hcrows, setHcrows] = React.useState([]);
  const [scansRows, setScansRows] = React.useState([]);
  const [scanDate, setScanDate] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [reloadHCcycle, setReloadHCcycle] = React.useState(false);
  const [urlHCcycle, setUrlHCcycle] = React.useState(decodeURIComponent(window.location.href.split('?')[1]?.split('=')[1])?.split("&")[0]);
  const [urlFilterProps, setUrlFilterProps] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[1]?.split('=')[1]));

  React.useEffect(() => {
    UserService.getChangeTickets().then((results) => {
      if (results.status === 200) {
        setHcrows(results.data);
      
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get HC API " + error);
    });
  }, [reloadHCcycle]);


  function CustomToolbarExport() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (

    <Box sx={{ height: 500, width: '100%' }} >
      <HeaderNavbar />

        <Typography           style={{padding: "5px"}}
 color="primary" variant='subtitle1' >  Change Request </Typography>
        <DataGrid 

         // style={{padding: "5px"}}
        
          rows={rows}
          columns={headCells}
          //checkboxSelection
          autoPageSize
          loading={loader}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          density="compact"
          components={{
            Toolbar:  CustomToolbarExport 
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: 'check_status', sort: 'desc' }],
            },
          }}

          filterModel={{
            items: [
              { columnField: urlFilterProps, operatorValue: 'isNotEmpty', value: 'isNotEmpty' }],
          }}
        />
        


     
    </Box>
  );
}
