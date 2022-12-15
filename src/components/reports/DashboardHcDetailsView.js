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
     params.row.scan_date ? `${moment(params.row.scan_date).format('DD-MM-YYYY hh:mm:ss') || ""}` : "",
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
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.violation_name}>
      <span> {currentRow?.violation_name}</span>
    </Tooltip>
    }
  },
  {
    field: 'measure_values',
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Measure Values',
    renderCell: (param) => {
      const currentRow = param.row;
      return currentRow?.measure_values?.length > 0 ? <ItemsDialog items={currentRow?.measure_values} title="Values" /> : ""
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
      return currentRow?.policy_parameters?.length > 0 ? <ItemsDialog items={currentRow?.policy_parameters} title="Parameters" /> : ""
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


const duplicateDeviationsData = (checks, urlFilterProps, policy='', urlVoilations, changeId, usedVid) => {
  let tempDevData = [];
  let id = 0;

  console.log("changeId", changeId, "usedVid", usedVid)

  for (let index = 0; index < checks.length; index++) {
    const element = checks[index];
    element?.hosts.forEach(host => {
     
       if(urlFilterProps === 'violations'){
        if (host.check_status === 'KO') {
         
          host.violations.forEach(violation => {
            let policyName = policy.split('-'); 

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
              violation_name : violation.message,
              displayPolicyName : `${policyName[0]} ${policyName[1]} v${policyName[3]}`,
              id: violation.id
            }
            const found = urlVoilations.find(element => element === violation.id);
            
            if(found !== violation.id && changeId == 'undefined'){
              tempDevData.push(hostData);
            } 
            else if(changeId != 'undefined'){ 
              const found = usedVid?.find(element => element === violation.id);
              if(found !== violation.id){
                tempDevData.push(hostData);
              }
            } 
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
    element?.hosts.forEach(host => {
      let policyName = policy.split('-'); 
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
        displayPolicyName : `${policyName[0]} ${policyName[1]} v${policyName[3]}`
      }


      if (host.check_status === 'OK' && urlFilterProps === 'checks') {
        tempDevData.push(hostData);
        id++;
      } else if( urlFilterProps === 'checks'){

        if (host.check_status === 'KO') {

          host.violations.forEach(violation => {
            let seperateHostdata = { ...hostData }; //hostData;  //
            seperateHostdata.id = violation.id;
            seperateHostdata.violation_name = violation.message;

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


export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [loader, setLoader] = React.useState(false);

  const [urlHCcycle, setUrlHCcycle] = React.useState(decodeURIComponent(window.location.href.split('?')[1]?.split('=')[1])?.split("&")[0]);
  const [urlFilterProps, setUrlFilterProps] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[1]?.split('=')[1]));
  const [urlVoilations, setUrlVoilations] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[2]?.split('=')[1]));
  const [changeId, setChangeId] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[3]?.split('=')[1]));
  const [usedVid, setUsedVid] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[4]?.split('=')[1]));

  const [selectionModel, setSelectionModel] = React.useState( [] );

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
              let usedVoilation = JSON.parse(urlVoilations); 

              let usedids = []; 
              if(usedVid != 'undefined'){
                usedids = JSON.parse(usedVid); 
              }

              let tempDevData = duplicateDeviationsData(checks, urlFilterProps, policy, usedVoilation, changeId, usedids);
              console.log("tempDevData", tempDevData, policy)
              tempDevData.forEach(element => {
              console.log("element.policyName", element.policyName)
              rowsData.push(element);
              });


             if(changeId != 'undefined'){ 
              let finalData = []; 

                usedVoilation.forEach(voiId => {
                  const found = rowsData.find(data => data.id === voiId);
                  finalData.push(found);
                  });

                  
                  rowsData.forEach(row => {
                    const found = finalData.find(data => data?.id === row?.id);
                    if( found == undefined)
                    finalData.push(row);
                    });
    
                console.log("finalData", finalData)
              rowsData = finalData;
              } 
             
                

           }else if(urlFilterProps === 'checks'){
              let tempDevData = getResults(checks, urlFilterProps, policy, rowsData);
              console.log("tempDevData checks", tempDevData, policy)
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

    if(urlVoilations != 'undefined' ){
      setSelectionModel(JSON.parse(urlVoilations)); 
    }

  }, []);

  const handleAssignment = () => {
  
    let param = {
      "violations": selectionModel,
    }
  
  UserService.updateChangeTicket(changeId, param).then((results) => {
      let data = results.data; 
      if (data.ok) {
          alert(data.message);
          window.opener.location.reload();
          window.close()
      }
    }).catch((error) => {
      console.log("error", error)
      Notify.showError("Error" + error); 
    });
  }

  function CustomToolbarExport() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
        &nbsp;&nbsp;
        {selectionModel.length > 0  ? <Button onClick={handleAssignment} size="small" variant='outlined'> Assign to change Ticket </Button> :"" }
        
      </GridToolbarContainer>
    );
  }

  console.log("changeId", changeId)
  return (

    <Box sx={{ height: 500, width: '100%' }}>
      <HeaderNavbar />

      <DataGrid //DataGridPremium
       
        rows={rows}
        columns={headCells}
        checkboxSelection={changeId != 'undefined' ? true :  false} 
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
      
        autoPageSize
        loading={loader}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        density="compact"
        components={{
          Toolbar:  CustomToolbarExport 
        }}
      />
    </Box>
  );
}
