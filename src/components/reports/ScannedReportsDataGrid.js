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


const duplicateDeviationsData = (devData, setRows,  setLoader) => {
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



export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [hccycleName, setHccycleName] = React.useState('');
  const [policies, setPolicies] = React.useState([]);
  const [policyName, setPolicyName] = React.useState('');
  const [hcrows, setHcrows] = React.useState([]);
  const [scansRows, setScansRows] = React.useState([]);
  const [scanDate, setScanDate] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [reloadHCcycle, setReloadHCcycle] = React.useState(false);

  React.useEffect(() => {
    UserService.getHCCycles().then((results) => {
      if (results.status === 200) {
        setHcrows(results.data);
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Error" + error);
    });
  }, [reloadHCcycle]);

  React.useEffect(() => {
    UserService.getScannedDates().then((results) => {
      if (results.status === 200) {
        setScansRows(results);
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Error" + error);
    });

  }, []);
  
React.useEffect(() => {
  console.log("hccycleName", hccycleName);
  if(hccycleName){
    let allPolicies = [];
      let hcCycle = hcrows.filter((item) => item.name === hccycleName);
        hcCycle.forEach(scan => {
        scan?.scans.forEach(scan => {
          scan?.policies.forEach(element => {
            allPolicies.push(element.name);
          });
        })
      })
      allPolicies =  allPolicies.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setPolicies(allPolicies)
      if(allPolicies?.length === 1){
        setPolicyName(allPolicies[0])
      }
  }
}, [hccycleName]);

React.useEffect(() => {
  console.log("scanDate", scanDate);
  if(scanDate){
    let allPolicies = [];
    let scansRow = scansRows.filter((item) => item.jobId === scanDate);
      scansRow.forEach(scan => {
        scan?.policies.forEach(element => {
            allPolicies.push(element.name);
          });
      })
      allPolicies =  allPolicies.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setPolicies(allPolicies)
      if(allPolicies?.length === 1){
        setPolicyName(allPolicies[0])
      }
  }
}, [scanDate]);

  React.useEffect(() => {
      console.log("hccycleName", hccycleName);
      console.log("policyName", policyName);

    if((hccycleName || scanDate) && policyName){
      setLoader(true);
      UserService.getDeviations(hccycleName, scanDate, policyName).then((results) => {
        if (results.status === 200) {
          duplicateDeviationsData(results.data, setRows,  setLoader);
        }
      }).catch((error) => {
        console.log("error", error)
       // alert("Error" + error);
        Notify.showError('Error' + error)
  
      });
    }
  }, [hccycleName, scanDate, policyName]);



  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarDensitySelector />
        <MergetoHCcycles setReloadHCcycle={setReloadHCcycle} />
        &nbsp;&nbsp;
        
        <HCcyclesSelect hcrows={hcrows} hccycleName={hccycleName} setHccycleName={setHccycleName} setScanDate={setScanDate}/>
        OR 
        <ScanDateSelect scansRows={scansRows} scanDate={scanDate} setScanDate={setScanDate}  setHccycleName={setHccycleName}/>

        <PolicySelect policies={policies} policyName={policyName} setPolicyName={setPolicyName} />

       
        {/* <div style={{ marginLeft: '30%' }}>
          <MergetoHCcycles />
        </div> */}

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
        loading={loader}
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
