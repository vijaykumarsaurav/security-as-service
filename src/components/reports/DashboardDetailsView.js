import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid';
// import {
//   DataGridPremium,
//   GridToolbarContainer,
//   GridToolbarExport,
//    GridToolbarDensitySelector,
// } from '@mui/x-data-grid-premium';

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
import moment from 'moment';
import Tooltip from '@mui/material/Tooltip';

const headCells = [
  {
    field: 'check_section',
    numeric: false,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Check Section',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.check_section}>
      <span> {currentRow?.check_section}</span>
    </Tooltip>
    }
  },
  {
    field: 'displayPolicyName',
    numeric: false,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Policy',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.displayPolicyName}>
      <span> {currentRow?.displayPolicyName}</span>
    </Tooltip>
    }
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
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.check_description}>
      <span> {currentRow?.check_description}</span>
    </Tooltip>
    }
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
    width: 160,
    sortable: true,
    editable: true,
    headerName: 'Scan Date',
     valueGetter: (params) =>
      `${moment(params.row.scan_date).format('DD-MM-YYYY hh:mm:ss') || ""}`,
  },

  // {
  //   id: 'violationName',
  //   width: 150,
  //   sortable: true,
  //   editable: true,
  //   headerName: 'Violation',
  //   valueGetter: (params) =>
  //     `${params.row.violationName || ""}`,
  // },
  {
    field: 'violation_name',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Violation',
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
      return <ItemsDialog items={currentRow?.policy_parameters} title="Parameters" />
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


const duplicateDeviationsData = (checks, urlFilterProps, policy='', rowsData) => {
  let tempDevData = [];
  let id = 0;


  for (let index = 0; index < checks.length; index++) {
    const element = checks[index];
    element?.hosts.forEach(host => {
      let hostData = {
        check_section: element.check_section,
        check_description: element.check_description,
        severity: element.severity,
        hostname: host.hostname,
        check_status: host.check_status,
        ip: host.ip,
        scan_date: host.scan_date,
        measure_values: host.measure_values,
        policy_parameters: host.policy_parameters,
        id: id,
        violation_name : "",
        displayPolicyName : ''
      }


      if (host.check_status === 'OK' && urlFilterProps === 'checks') {
        tempDevData.push(hostData);
        id++;
      } else if(urlFilterProps === 'violations' || urlFilterProps === 'checks'){
        if (host.check_status === 'KO') {
          host.violations.forEach(violation => {
            let seperateHostdata = hostData;  //{ ...hostData };
            seperateHostdata.id = id;
            seperateHostdata.violation_name = violation.message;
            seperateHostdata.displayPolicyName =  policy

            tempDevData.push(seperateHostdata);
            // if(violation.message){
            //   tempDevData.push(seperateHostdata);
            // }
            id++;
          })
        }
      }
      
    });

  }

  //let rowsData =  [...rows]; 
  //rowsData.concat(tempDevData);
 //setRows(rows.concat(tempDevData));
 // setLoader(false);
 return tempDevData;
};

const getResults = (checks, urlFilterProps, policy='', rowsData) => {
  let tempDevData = [];
  let id = 0;


  for (let index = 0; index < checks.length; index++) {
    const element = checks[index];
    let hostData = {
      check_section: element.check_section,
      check_description: element.check_description,
      severity: element.severity,
      displayPolicyName : policy,

      hostname: '',
      ip: '',
      scan_date:'',
      measure_values: '',
      policy_parameters: '',
      id: id,
      violation_name : "",
    }
    tempDevData.push(hostData);
    let hostnames =[];
    // element?.hosts.forEach(host => {
      
    //   hostnames.push(host.hostname); 
    //   hostData.check_status = host.check_status; 
    //   if (host.check_status === 'KO') {
    //     let violations = []
    //     host.violations.forEach(violation => {
    //       violations.push(violation.message);
    //     })
    //     hostData.violation_name = violations.join(',');
    //   }
    //   tempDevData.push(hostData);

      
    // });
    // hostData.hostname = hostnames.join(',');


  }

  //let rowsData =  [...rows]; 
  //rowsData.concat(tempDevData);
 //setRows(rows.concat(tempDevData));
 // setLoader(false);
 return tempDevData;
};


export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [loader, setLoader] = React.useState(false);

  const [urlHCcycle, setUrlHCcycle] = React.useState(decodeURIComponent(window.location.href.split('?')[1]?.split('=')[1])?.split("&")[0]);
  const [urlFilterProps, setUrlFilterProps] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[1]?.split('=')[1]));

  React.useEffect(() => {
    setLoader(true)

    UserService.getCycleDetails(urlHCcycle).then((results) => {
      if (results.status === 200) {
       // setRows(results.data);
       let rowsData = []; 

        for (let index = 0; index < results.data.length; index++) {
          const checks = results.data[index]?.checks;
          const policy = results.data[index]?.policy;

           if(urlFilterProps === 'violations'){
              let tempDevData = duplicateDeviationsData(checks, urlFilterProps, policy, rowsData);
              console.log("tempDevData", tempDevData, policy)
              tempDevData.forEach(element => {
              console.log("element.policyName", element.policyName)
              rowsData.push(element);
              });
           }else if(urlFilterProps === 'checks'){
              let tempDevData = getResults(checks, urlFilterProps, policy, rowsData);
              console.log("tempDevData", tempDevData, policy)
              tempDevData.forEach(element => {
              console.log("element.policyName", element.policyName)
              rowsData.push(element);
              });
           }
         
          //rowsData.concat(tempDevData);
        }
        setRows(rowsData)
       // console.log("rowsData", rowsData)
        //
        setLoader(false)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get HC API " + error);
    });
  }, []);

  function CustomToolbarExport() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }



  return (

    <Box sx={{ height: 500, width: '100%' }}>
      <HeaderNavbar />

      <DataGrid //DataGridPremium
       
        rows={rows}
        columns={headCells}
        //pageSize={20}
        // rowsPerPageOptions={[5, 10, 20, 50]}
        //checkboxSelection
        autoPageSize
        loading={loader}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        density="compact"
        // components={{
        //   Toolbar: urlHCcycle == 'undefined' ? CustomToolbar : "",
        // }}
        components={{
          Toolbar:  CustomToolbarExport 
        }}
        
        // initialState={{
        //   sorting: {
        //     sortModel: [{ field: 'check_status', sort: 'desc' }],
        //   },
        // }}

        // filterModel={{
        //   items: [
        //     { columnField: urlFilterProps, operatorValue: 'isNotEmpty', value: 'isNotEmpty' }],
        // }}

      // editMode="row"
      />
    </Box>
  );
}
