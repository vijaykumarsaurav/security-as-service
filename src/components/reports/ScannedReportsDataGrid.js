import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService';
import ItemsDialog from './ItemsDialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select, Button } from '@mui/material';
import MergetoHCcycles from './MergetoHCcycles';
import Notify from '../utils/Notify';
import HCcyclesSelect from './HCcyclesSelect';
import ScanDateSelect from './ScanDateSelect';
import PolicySelect from './PolicySelect';


const headCells = [
  {
    field: 'check_section',
    numeric: false,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Check Section',
  },
  {
    field: 'severity',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Severity',
  },
  {
    field: 'check_description',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Check Description',
  },
  {
    field: 'hostname',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Hostname',
  },

  {
    field: 'check_status',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Check status',
  },
  {
    field: 'ip',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'IP address',
  },
  {
    field: 'scan_date',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Scan Date',
  },

  {
    id: 'violation1',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Violation',
    valueGetter: (params) =>
      `${params.row.violation1 || ''}`,
  },
  {
    field: 'measure_values',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Measure Values',
    renderCell: (param) => {
      const currentRow = param.row;
      return <ItemsDialog items={currentRow?.measure_values} title="Values" />
    }
  },
  {
    field: 'policy_parameters',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Policy Parameters',
    renderCell: (param) => {
      const currentRow = param.row;
      return <ItemsDialog items={currentRow?.policy_parameters} title="Values" />
    }
    //   renderCell: (params) => {
    //     const onClick = (e) => {
    //       const currentRow = params.row;
    //       return alert(JSON.stringify(currentRow, null, 4));
    //     };

    //     return (
    //       <button variant="outlined" color="error" size="small" onClick={onClick}>View Json</button>
    //     );
    // },
  }
];


const duplicateDeviationsData = (devData, setRows) => {
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
};


export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [hccycleName, setHccycleName] = React.useState('');
  const [policies, setPolicies] = React.useState([]);
  const [policyName, setPolicyName] = React.useState('');
  const [hcrows, setHcrows] = React.useState([]);
  const [scansRows, setScansRows] = React.useState([]);
  
    React.useEffect(() => {
      UserService.getScannedDates().then((results) => {
        if (results.status === 200) {
          // console.log("results", results.data);
          setScansRows(results);
        }
      }).catch((error) => {
        console.log("error", error)
        // setRowsWait(false);
        alert("Error" + error);
  
      });
  
    }, []);

  React.useEffect(() => {
    UserService.getHCCycles().then((results) => {
      if (results.status === 200) {
        setHcrows(results.data);

        let allPolicies = [];
      //  let hcCycle = results.data.filter((item) => item.name === healthCheckName);
          results.data?.forEach(scan => {
          scan?.scans.forEach(scan => {
            scan?.policies.forEach(element => {
              allPolicies.push(element.name);
            });
          })
        })
        setPolicies(allPolicies)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Error" + error);
    });
  }, []);

  React.useEffect(() => {
      console.log("hccycleName", hccycleName);
      console.log("policyName", policyName);
      
    if(hccycleName && policyName){
      UserService.getDeviations(hccycleName, policyName).then((results) => {
        if (results.status === 200) {
          // console.log("results", results.data);
          duplicateDeviationsData(results.data, setRows);
        }
      }).catch((error) => {
        console.log("error", error)
        // setRowsWait(false);
       // alert("Error" + error);
        Notify.showError('Error' + error)
  
      });
    }

  }, [hccycleName, policyName]);



  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarDensitySelector />
        <HCcyclesSelect hcrows={hcrows} setHccycleName={setHccycleName}/>
        <ScanDateSelect scansRows={scansRows} />

        <PolicySelect policies={policies} setPolicyName={setPolicyName} />

        <div style={{ marginLeft: '40%' }}>
          <MergetoHCcycles />
        </div>

      </GridToolbarContainer>
    );
  }

  return (

    <Box sx={{ height: 500, width: '100%' }}>
      <HeaderNavbar />

      <DataGrid
        rows={rows}
        columns={headCells}
        //pageSize={20}
        // rowsPerPageOptions={[5, 10, 20, 50]}
        checkboxSelection
        autoPageSize
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        density="compact"
        components={{
          Toolbar: CustomToolbar,
        }}

      // editMode="row"
      />
    </Box>
  );
}
