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
import MergetoHCcycles from './MergetoHCcycles';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';

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
    field:  'name',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Cycle Name',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.name}>
      <span> {currentRow?.name}</span>
    </Tooltip>
    }
  },
  {
    field: 'policies',
    numeric: true,
    width: 210,
    sortable: true,
    editable: true,
    headerName: 'Policies',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.policies.join()}>
      <span> {currentRow?.policies.join()}</span>
    </Tooltip>//<bigTextDisplay policies={currentRow?.policies} />
    }
    // valueGetter: (params) =>
    //   `${params.row?.policy?.join() || ''}`,
  },
  {
    field: 'scanRange',
    numeric: true,
    width: 175,
    sortable: true,
    editable: true,
    headerName: 'Scan Range',
    renderCell: (param) => {
      const currentRow = param.row;
      return   <Tooltip title={currentRow?.scanRange}>
      <span> {currentRow?.scanRange}</span>
    </Tooltip>
    }
  },
  {
    field: 'status',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Status',
  },
  {
    field: 'hostname',
    width: 85,
    sortable: true,
    editable: true,
    headerName: 'Hostnames',
    // renderCell: (param) => {
    //   const currentRow = param.row;
    //   return <a size='small' variant="outlined" href="#/dashboard" >{currentRow?.statistic?.hostnames}</a>
    // }
    renderCell: (param) => {
      const currentRow = param.row;
      return <DashboardDialog count={currentRow?.statistic?.hostnames} id={currentRow?.id} title="Hostnames" />
    }
    ,
  },
  {
    field: 'ADPS',
    width: 75,
    sortable: true,
    editable: true,
    headerName: 'ADPS',
    // renderCell: (param) => {
    //   const currentRow = param.row;
    //   return   <a href="#/dashboard" >{currentRow?.ADPS }</a>
    // }
     valueGetter: (params) =>
      `${params.row?.statistic?.adps || ''}`,
  },
  {
    id: 'checks',
    width: 75,
    sortable: true,
    editable: true,
    headerName: 'Checks',
    // renderCell: (param) => {
    //   const currentRow = param.row;
    //   return <a href="#/dashboard" >{currentRow?.statistic?.checks}</a>
    // }
    renderCell: (param) => {
      const currentRow = param.row;
      return <DashboardDialog count={currentRow?.statistic?.checks} id={currentRow?.id} title="Checks" />
    }
  },
  {
    field: 'violations',
    width: 75,
    sortable: true,
    editable: true,
    headerName: 'Violations',
    valueGetter: (params) =>
      `${params.row.violations || ''}`,
    // renderCell: (param) => {
    //   const currentRow = param.row;
    //   return <Button size='small' variant="outlined" href="#/dashboard" >{currentRow?.statistic?.violations}</Button>
    // }
    renderCell: (param) => {
      const currentRow = param.row;
      return <DashboardDialog count={currentRow?.statistic?.violations} id={currentRow?.id} title="Violations" />
    }
  },
  {
    field: 'dueDate',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'HC Cycle Due Date',
    valueGetter: (params) =>
      `${params.row.hcCycleDueDate || ''}`,
  },
  {
    field: 'assignee',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Assignee',
  },

];


const headCellsUnassignedScan = [
  {
    field: 'id',
    numeric: false,
    width: 50,
    sortable: true,
    editable: true,
    headerName: 'Id',
  },
  {
    field: 'Ansible_Job',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Ansible Job',
  },
  {
    field: 'Scan_Date',
    numeric: true,
    width: 210,
    sortable: true,
    editable: true,
    headerName: 'Scan Date',
   
  },
  {
    field: 'checks',
    numeric: true,
    width: 175,
    sortable: true,
    editable: true,
    headerName: 'Checks',
  
  },
  {
    field: 'hostname',
    width: 85,
    sortable: true,
    editable: true,
    headerName: 'Hostnames',
    renderCell: (param) => {
      const currentRow = param.row;
      return <a size='small' variant="outlined" href="#/dashboard" >{currentRow?.hostname}</a>
    }
  },
  {
    field: 'violations',
    width: 75,
    sortable: true,
    editable: true,
    headerName: 'Violations',
    valueGetter: (params) =>
      `${params.row.violations || ''}`,
    renderCell: (param) => {
      const currentRow = param.row;
      return <Button size='small' variant="outlined" href="#/dashboard" >{currentRow?.violations}</Button>
    }
  },
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



export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([{
    id: "2",
    cycle_name: "Financially significant systems",
    policies: ["Windows 2019", "Windows 2022"],
    scanRange: "28/Oct/2022 3/Nov/2022",
    status: "Draft",
    hostname: "62",
    ADPS: "123",
    checks: "22",
    hostname: "62",
    violations: "33",
    hcCycleDueDate: "28/Oct/2022",
    assignee: "Vijay"
  }, {
    id: "3",
    cycle_name: "Prod systems",
    policies: ["Windows2022_3"],
    scanRange: "28/Oct/2022 3/Nov/2022",
    status: "Assigning Violations",
    hostname: "21",
    ADPS: "22",
    checks: "22",
    hostname: "33",
    violations: "11",
    hcCycleDueDate: "29/Oct/2022",
    assignee: "Pavel"
  },
  {
    id: "4",
    cycle_name: "Red Hat, Suse",
    policies: ["Windows2022_4"],
    scanRange: "28/Oct/2022 3/Nov/2022",
    status: "Client Review",
    hostname: "21",
    ADPS: "22",
    checks: "22",
    hostname: "33",
    violations: "11",
    hcCycleDueDate: "29/Dec/2022",
    assignee: "Blade"
  }]);

  const [rowsUnassignedScan, setRowsUnassignedScan] = React.useState([{
    id: "13493",
    Ansible_Job: "zz1_jobtemplate_healthscan_scan_windows_os_kemistry",
    Scan_Date: "28/Oct/2022",
    hostname: "2",
    checks: "7",
    violations: "5",
  }, {
    id: "2",
    Ansible_Job: "Windows",
    Scan_Date: "28/Oct/2022",
    hostname: "2",
    checks: "62",
    violations: "359",
  }]);
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
        let policiesList = results.data; 
        
        let allPolicies = [], scanDates = []; 
        policiesList.forEach(policy => {
          policy?.scans.forEach(scan => {
            scanDates.push(moment(scan.date)); 
            scan?.policies.forEach(element => {
              allPolicies.push(element.name);
            });
          })
          scanDates.sort((a, b)=> moment(b) - moment(a)); 
          policy.scanRange = scanDates[0].format('DD-MMM-YYYY') + " " + scanDates[scanDates.length-1].format('DD-MMM-YYYY');  
          policy.policies = allPolicies; 
        })

        setHcrows(policiesList);
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get HC API " + error);
    });
  }, [reloadHCcycle]);

  // React.useEffect(() => {
  //   UserService.getScannedDates().then((results) => {
  //     if (results.status === 200) {
  //       setScansRows(results.data);
  //     }
  //   }).catch((error) => {
  //     console.log("error", error)
  //     alert("Error" + error);
  //     alert("Fail to connect get Scan Dates API " + error);

  //   });

  // }, [reloadHCcycle]);

  React.useEffect(() => {
    console.log("hccycleName", hccycleName);
    if (hccycleName) {
      let allPolicies = [];
      let hcCycle = hcrows.filter((item) => item.name === hccycleName);
      hcCycle.forEach(scan => {
        scan?.scans.forEach(scan => {
          scan?.policies.forEach(element => {
            allPolicies.push(element.name);
          });
        })
      })
      allPolicies = allPolicies.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setPolicies(allPolicies)
      if (allPolicies?.length === 1) {
        setPolicyName(allPolicies[0])
      }
    }
  }, [hccycleName]);

  React.useEffect(() => {
    console.log("scanDate", scanDate);
    if (scanDate) {
      let allPolicies = [];
      let scansRow = scansRows.filter((item) => item.jobId === scanDate);
      scansRow.forEach(scan => {
        scan?.policies.forEach(element => {
          allPolicies.push(element.name);
        });
      })
      allPolicies = allPolicies.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setPolicies(allPolicies)
      if (allPolicies?.length === 1) {
        setPolicyName(allPolicies[0])
      }
    }
  }, [scanDate]);

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


  return (

    <Box sx={{ height: 500, width: '100%',   }}>
      <HeaderNavbar />
      <br />

      
      <Paper  style={{  height: '50%', width: '99%', paddingBottom: "25px" }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
          <Typography color="primary" style={{paddingLeft: "5px"}}>  Active Health Check cycles</Typography>
          </Grid>
        
          <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          <MergetoHCcycles />
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
      <Paper style={{ paddingLeft: "10px", height:"200px", paddingBottom: "25px", width: '60%' }}>

        <Grid justify="space-between" container>

          <Grid item>
            <Typography color="primary">Unassigned Scans</Typography>
          </Grid>
        </Grid>

        <DataGrid
          rows={rowsUnassignedScan}
          columns={headCellsUnassignedScan}
          autoPageSize
          loading={loader}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          density="compact"
        />

      </Paper>
    </Box>
  );
}
