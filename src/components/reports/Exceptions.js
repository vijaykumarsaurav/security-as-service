import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService';
import DashboardDialog from './DashboardDialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select, Button, Typography, Paper, Grid } from '@mui/material';
import Notify from '../utils/Notify';
import HCcyclesSelect from './HCcyclesSelect';
import ScanDateSelect from './ScanDateSelect';
import PolicySelect from './PolicySelect';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ScansAssignToHCCycle from './ScansAssignToHCCycle';
import MergetoHCcycles from './MergetoHCcycles';
import EditHCcycles from './EditHCcycles';
import UpdateHCcycles from './UpdateHCcycles';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import CalibrationPolicyParamDialog from './CalibrationPolicyParamDialog';

const headCells = [
  {
    field: 'id',
    numeric: false,
    width: 50,
    sortable: true,
    editable: true,
    headerName: 'Id',
  },
  {
    field:  'section',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Section',
  },
  {
    field: 'policy',
    numeric: true,
    minWidth: 175,
    sortable: true,
    editable: true,
    headerName: 'Policy',
  },
  {
    field: 'priority',
    numeric: true,
    width: 185,
    sortable: true,
    editable: true,
    headerName: 'Priority',
  },
  {
    field: 'pattern',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Pattern',
  },
  {
    field: 'policy_parameters',
    width: 200,
    sortable: true,
    editable: true,
    headerName: 'Policy Parameters',
    renderCell: (param) => {
      const currentRow = param.row;
      return currentRow?.policyParameters?.length > 0 ? <CalibrationPolicyParamDialog items={currentRow?.policyParameters} title="Policy Parameters" /> : ""
    },
  }
];

const handleDelete = (id) => {
  
  if(window.confirm("Are you sure to delete HC cycle?"))
  UserService.deleteHCCycle(id).then((results) => {
      let data = results.data; 
      if (data.ok) {
          alert(data.message);
           window.location.reload(true)
      }
    }).catch((error) => {
      console.log("error", error)
      alert(error);
    });

  
};
const headCellSuppresstion = [
  {
    field: 'id',
    numeric: false,
    width: 50,
    sortable: true,
    editable: true,
    headerName: 'Id',
  },
  {
    field:  'section',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Section',
  },
  {
    field: 'policy',
    numeric: true,
    minWidth: 175,
    sortable: true,
    editable: true,
    headerName: 'Policy',
  },
  {
    field: 'priority',
    numeric: true,
    width: 185,
    sortable: true,
    editable: true,
    headerName: 'Priority',
  },
  {
    field: 'pattern',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Pattern',
  },
  {
    field: 'violation',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Violation',
  },
  {
    field: 'active',
    width: 200,
    sortable: true,
    editable: true,
    headerName: 'Status',
    valueGetter: (params) =>
    `${params.row.active ? 'Active' : "Inactive"}`
  }
];


const bigTextDisplay = ({ array }) => {

  // let policiesList = []
  //   policies.forEach(element => {
  //     policiesList.push(<Button style={{padding: "5px"}}> {element}</Button>)
  // });

  // return policiesList; 

  return (

    <Tooltip title={array.join()}>
      <span> {array.join()}</span>
    </Tooltip>

    // <Stack title={policies.join()} direction="row" spacing={1}>
    //   {policies.map(policy => <Chip label={policy} />  )}
    // </Stack>

  )


}

const duplicateDeviationsData = (devData, setRows, setLoader) => {
  let tempDevData = [];
  let id = 0;
  console.log("tempDevData", devData)


  for (let index = 0; index < devData.length; index++) {
    const element = devData[index];
    element?.hosts.forEach(host => {
      let hostData = {
        check_section: element.check_section,
        check_description: element.check_description,
        severity: element.severity,
        hostname: host.hostname,
        check_status: host.check_status,
        ip: host.ip,
        scan_date: host.scan_date,
        violation1: host.measure_values,
        measure_values: host.measure_values,
        policy_parameters: host.policy_parameters,
        id: id
      }

      if (host.check_status === 'OK') {
        tempDevData.push(hostData);
        id++;
      }
      else if (host.check_status === 'KO') {
        host.violations.forEach(violation => {
          let seperateHostdata = { ...hostData };
          seperateHostdata.id = id;
          seperateHostdata.violation1 = violation.message;
          tempDevData.push(seperateHostdata);
          id++;
        })
      }

    });

  }

  setRows(tempDevData);
  setLoader(false);
};

const getPolicies = (scan, policiesList) => {
  scan?.policies.forEach(element => {
    let policyName = element.name.split('-'); 
    policiesList.push(`${policyName[0]} ${policyName[1]} v${policyName[3]}`);
  });
  return policiesList; 
}
 
export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowsUnassignedScan, setRowsUnassignedScan] = React.useState([]);
  const [hccycleName, setHccycleName] = React.useState('');
  const [policies, setPolicies] = React.useState([]);
  const [policyName, setPolicyName] = React.useState('');
  const [hcrows, setHcrows] = React.useState([]);
  const [scansRows, setScansRows] = React.useState([]);
  const [falsePositiveRows, setFalsePositiveRows] = React.useState([]);

  const [scanDate, setScanDate] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [loaderScan, setLoaderScan] = React.useState(false);

  const [reloadHCcycle, setReloadHCcycle] = React.useState(false);
  const [reloadScanApi, setReloadScanApi] = React.useState(false);

  const [selectionModel, setSelectionModel] = React.useState([]);
   
  React.useEffect(() => {
    setLoader(true); 

    UserService.getCalibrations().then((results) => {
      if (results.status === 200) {
        let hcList = results.data; 
      
        setHcrows(hcList);
        setLoader(false)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get HC API " + error);
    });
  }, [reloadScanApi, reloadHCcycle]);

  React.useEffect(() => {
    setLoaderScan(true)

    let policiesList = []; 

    UserService.getSuppressions().then((results) => {
      if (results.status === 200) {
        
        setScansRows(results.data);
        setLoaderScan(false)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Error" + error);
      alert("Fail to connect get Scan Dates API " + error);
    });

  }, [reloadScanApi, reloadHCcycle]);


  React.useEffect(() => {
    setLoaderScan(true)

    let policiesList = []; 

    UserService.getFalsePositive().then((results) => {
      if (results.status === 200) {
        
        setFalsePositiveRows(results.data);
        setLoaderScan(false)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Error" + error);
      alert("Fail to connect get Scan Dates API " + error);
    });

  }, [reloadScanApi, reloadHCcycle]);



  // React.useEffect(() => {
  //     console.log("hccycleName", hccycleName);
  //     console.log("policyName", policyName);

  //   if((hccycleName || scanDate) && policyName){
  //     setLoader(true);
  //     UserService.getDeviations(hccycleName, scanDate, policyName).then((results) => {
  //       if (results.status === 200) {
  //         duplicateDeviationsData(results.data, setRows,  setLoader);
  //       }
  //     }).catch((error) => {
  //       console.log("error", error)
  //      // alert("Error" + error);
  //       Notify.showError('Error' + error)

  //     });
  //   }
  // }, [hccycleName, scanDate, policyName]);

  // headCells[headCells.length-3].renderCell = (param) => {
  //   const currentRow = param.row;
  //    return <div>  <UpdateHCcycles setReloadScanApi={setReloadScanApi} setReloadHCcycle={setReloadHCcycle} currentRow={currentRow} />  
  //      </div>; 
  // }

  console.log("scanDate", headCells[headCells.length-1]);


  return (

    <Box sx={{ height: 500, width: '100%',   }}>
      <HeaderNavbar />
      <br />
      
      <Paper style={{ paddingLeft: "10px", height:"250px", paddingBottom: "25px", width: '99%' }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
          <Typography color="primary" style={{padding: "5px"}}>Calibrations</Typography>
          </Grid>
        
          <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          </Grid>
        </Grid>

        <DataGrid
        
          rows={hcrows}
          columns={headCells}
          autoPageSize
          loading={loader}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          density="compact"
        />

      </Paper>

      <br />
      <Paper style={{ paddingLeft: "10px", height:"250px", paddingBottom: "25px", width: '99%' }}>

        <Grid justify="space-between" container>

          <Grid item>
            <Typography style={{padding: "5px"}} color="primary">Suppressions</Typography>
          </Grid>
          {/* <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          <ScansAssignToHCCycle setReloadScanApi={setReloadScanApi} scansRows={scansRows} selectionModel={selectionModel} hcrows={hcrows}/>
          </Grid> */}
        </Grid>

        <DataGrid
          rows={scansRows}
          columns={headCellSuppresstion}
          autoPageSize
          loading={loaderScan}
          disableSelectionOnClick
         // checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          experimentalFeatures={{ newEditingApi: true }}
          density="compact"
        />

      </Paper>


      <br />
      <Paper style={{ paddingLeft: "10px", height:"250px", paddingBottom: "25px", width: '99%' }}>

        <Grid justify="space-between" container>

          <Grid item>
            <Typography style={{padding: "5px"}} color="primary">False Positives</Typography>
          </Grid>
          {/* <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          <ScansAssignToHCCycle setReloadScanApi={setReloadScanApi} scansRows={scansRows} selectionModel={selectionModel} hcrows={hcrows}/>
          </Grid> */}
        </Grid>

        <DataGrid
          rows={falsePositiveRows}
          columns={headCellSuppresstion}
          autoPageSize
          loading={loaderScan}
          disableSelectionOnClick
         // checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          experimentalFeatures={{ newEditingApi: true }}
          density="compact"
        />

      </Paper>
    </Box>
  );
}
