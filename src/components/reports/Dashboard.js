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
    minWidth: 175,
    
    sortable: true,
    editable: true,
    headerName: 'Policies',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.policies}>
      <span> {currentRow?.policies}</span>
    </Tooltip>//<bigTextDisplay policies={currentRow?.policies} />
    }
    // valueGetter: (params) =>
    //   `${params.row?.policy?.join() || ''}`,
  },
  {
    field: 'scanRange',
    numeric: true,
    width: 185,
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
      return <DashboardDialog cycle_name={currentRow?.name} count={currentRow?.statistic?.hostnames} id={currentRow?.id} title="Hostnames" />
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
    headerName: 'Results',
    // renderCell: (param) => {
    //   const currentRow = param.row;
    //   return <a href="#/dashboard" >{currentRow?.statistic?.checks}</a>
    // }
    renderCell: (param) => {
      const currentRow = param.row;
      return <Button size='small' variant="outlined" target={'_blank'} href={"#/dashboard-details-view?hc="+currentRow?.id+"&f=checks"} >{currentRow?.statistic?.checks}</Button>//<DashboardDialog cycle_name={currentRow?.name} count={currentRow?.statistic?.checks} id={currentRow?.id} title="Checks" />
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
       return <Button size='small' variant="outlined" target={'_blank'} href={"#/dashboard-details-view?hc="+currentRow?.id+"&f=violations" } >{currentRow?.statistic?.violations}</Button>
      //<DashboardDialog cycle_name={currentRow?.name} count={currentRow?.statistic?.violations} id={currentRow?.id} title="Violations" />
    }
  },
  {
    field: 'dueDate',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Due Date',
    valueGetter: (params) =>
    `${moment(params.row.dueDate).format('DD-MM-YYYY') || ''}`,

  },
  {
    field: 'assignee',
    width: 100,
    sortable: true,
    editable: true,
    headerName: 'Assignee',
  },
  {
    field: 'Edit',
    width: 100,
    sortable: true,
    editable: true,
    headerName: 'Edit',
    renderCell: (param) => {
      const currentRow = param.row;
       return  <div>  <UpdateHCcycles currentRow={currentRow} />  
      
       </div> //<EditHCcycles currentRow={currentRow} />
    }
  },
  {
    field: 'Delete',
    width: 100,
    sortable: true,
    editable: true,
    headerName: 'Delete',
    renderCell: (param) => {
      const currentRow = param.row;
       return  <div> 
       <Button size='small' variant="outlined"  onClick={() => handleDelete(currentRow.id)} > <DeleteIcon /></Button>
       </div> //<EditHCcycles currentRow={currentRow} />
    }
  },
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
const headCellsUnassignedScan = [
  {
    field: 'jobId',
    numeric: false,
    width: 80,
    sortable: true,
    editable: true,
    headerName: 'Job Id',
  },
  {
    field: 'name',
    numeric: true,
    width: 280,
    sortable: true,
    editable: true,
    headerName: 'Ansible Job',
  },
  {
    field: 'policies',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Policies',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.policies}>
      <span> {currentRow?.policies}</span>
    </Tooltip>
    }
  },
  
  {
    field: 'date',
    numeric: true,
    width: 180,
    sortable: true,
    editable: true,
    headerName: 'Scan Date',
    valueGetter: (params) =>
      `${moment(params.row.scan_date).format('DD-MM-YYYY hh:mm A') || ''}`,
    
   
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
      return <DashboardDialog cycle_name={currentRow?.name} count={currentRow?.statistic?.hostnames} id={currentRow?.id} title="Hostnames" dashboardType={"unassignedScan"} />
    }
    ,
  },
  {
    id: 'checks',
    width: 75,
    sortable: true,
    editable: true,
    headerName: 'Results',
    // renderCell: (param) => {
    //   const currentRow = param.row;
    //   return <a href="#/dashboard" >{currentRow?.statistic?.checks}</a>
    // }
    renderCell: (param) => {
      const currentRow = param.row;
      return <Button size='small' variant="outlined" target={'_blank'} href={"#/dashboard-details-view?jobid="+currentRow?.id+"&sort=checks"} >{currentRow?.statistic?.checks}</Button>//<DashboardDialog cycle_name={currentRow?.name} count={currentRow?.statistic?.checks} id={currentRow?.id} title="Checks" />
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
       return <Button size='small' variant="outlined" target={'_blank'} href={"#/dashboard-details-view?hc="+currentRow?.id+"&sort=violations" } >{currentRow?.statistic?.violations}</Button>
      //<DashboardDialog cycle_name={currentRow?.name} count={currentRow?.statistic?.violations} id={currentRow?.id} title="Violations" />
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
  const [scanDate, setScanDate] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [loaderScan, setLoaderScan] = React.useState(false);

  const [reloadHCcycle, setReloadHCcycle] = React.useState(false);
  const [reloadScanApi, setReloadScanApi] = React.useState(false);

  const [selectionModel, setSelectionModel] = React.useState([]);
   
  React.useEffect(() => {
    setLoader(true); 

    UserService.getHCCycles().then((results) => {
      if (results.status === 200) {
        let hcList = results.data; 
        let policiesList = []; 
        hcList.forEach(hcCycle => {
          let scanDates = []; 
          hcCycle?.scans.forEach(scan => {
            scanDates.push(moment(scan.date).format('DD-MMM-YYYY hh:mm:ss')); 
            hcCycle.policies =  [...new Set(getPolicies(scan, policiesList))];;
          })
          scanDates.sort((a, b)=> moment(a) - moment(b)); 
          hcCycle.scanRange = scanDates[0] + " " + scanDates[scanDates.length-1];  
        })

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

    UserService.getScannedDates().then((results) => {
      if (results.status === 200) {
        results.data.forEach(scan => {
          scan.policies =  [...new Set(getPolicies(scan, policiesList))];;
        });
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

  headCells[headCells.length-2].renderCell = (param) => {
    const currentRow = param.row;
     return <div>  <UpdateHCcycles setReloadScanApi={setReloadScanApi} setReloadHCcycle={setReloadHCcycle} currentRow={currentRow} />  
       </div>; 
  }

  console.log("scanDate", headCells[headCells.length-1]);


  return (

    <Box sx={{ height: 500, width: '100%',   }}>
      <HeaderNavbar />
      <br />

      
      <Paper  style={{  height: '50%', width: '99%', paddingBottom: "25px" }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
          <Typography color="primary" style={{padding: "5px"}}>  Health Check Cycles</Typography>
          </Grid>
        
          <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          <MergetoHCcycles setReloadScanApi={setReloadScanApi}  setReloadHCcycle={setReloadHCcycle}/>
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
            <Typography style={{padding: "5px"}} color="primary">Unassigned Scans</Typography>
          </Grid>
          {/* <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          <ScansAssignToHCCycle setReloadScanApi={setReloadScanApi} scansRows={scansRows} selectionModel={selectionModel} hcrows={hcrows}/>
          </Grid> */}
        </Grid>

        <DataGrid
          rows={scansRows}
          columns={headCellsUnassignedScan}
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
