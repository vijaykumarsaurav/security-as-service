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
import ViolationsDialog from './ViolationsDialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select, Button, Typography, Paper, Grid } from '@mui/material';
import CreateChangeRequest from './CreateChangeRequest';
import CreateChangeEdit from './CreateChangeEdit';

import Notify from '../utils/Notify';
import HCcyclesSelect from './HCcyclesSelect';
import ScanDateSelect from './ScanDateSelect';
import PolicySelect from './PolicySelect';
import moment from 'moment';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterIcon from '@mui/icons-material/Filter';
const headCells = [
  {
    field: 'type',
    numeric: false,
    width: 120,
    sortable: true,
    editable: true,
    headerName: 'Type',
  },
  {
    field: 'risk',
    numeric: true,
    width: 100,
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
  // {
  //   field: 'correlation_display',
  //   numeric: true,
  //   width: 150,
  //   sortable: true,
  //   editable: true,
  //   headerName: 'Correlation Display',
  // },
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
  // {
  //   field: 'unassigned_violations',
  //   width: 160,
  //   sortable: true,
  //   editable: true,
  //   headerName: 'Unassigned Violations',
  //     renderCell: (param) => {
  //     const currentRow = param.row;
  //     return currentRow?.unassigned_violations > 0 ? <span> {currentRow?.unassigned_violations} Violations</span> : '' 
  //   }
  // },
  // {
  //   field: 'violations',
  //   width: 150,
  //   sortable: true,
  //   editable: true,
  //   headerName: 'Violations',
  //   // renderCell: (param) => {
  //   //   const currentRow = param.row;
  //   //   return <Button onClick={() => alert(JSON.stringify(currentRow?.violations))}> {currentRow?.violations?.length} Violations</Button>
  //   // }
  //   renderCell: (param) => {
  //     const currentRow = param.row;
    
  //     return currentRow?.unassigned_violations > 0 ? '' : <ViolationsDialog items={currentRow?.violations} title="Violations" />
  //   }
  // },
  {
    field: 'manage_voilations',
    width: 140,
    sortable: true,
    editable: true,
    headerName: 'Violations',
  },
  {
    field: 'Edit',
    width: 100,
    sortable: true,
    editable: true,
    headerName: 'Edit',
    renderCell: (param) => {
      const currentRow = param.row;

       return   currentRow?.unassigned_violations >= 0 ? '' : <div>  <CreateChangeRequest actionType={"Edit"}  currentRow={currentRow} urlHCcycle={currentRow?.id}/>  </div> 
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
       return currentRow?.unassigned_violations >= 0 ? '' : <div> 
       <Button size='small' variant="outlined"  onClick={() => handleDelete(currentRow.id)} > <DeleteIcon /></Button>
       </div> //<EditHCcycles currentRow={currentRow} />
    }
  },
];

const handleDelete = (id) => {
  
  if(window.confirm("Are you sure to delete the change request  ?"))
  UserService.deleteChangeRequest(id).then((results) => {
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

export default function ScannedReportsDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [hccycleName, setHccycleName] = React.useState('');
  const [policies, setPolicies] = React.useState([]);
  const [policyName, setPolicyName] = React.useState('');
  const [hcrows, setHcrows] = React.useState([]);
  const [scansRows, setScansRows] = React.useState([]);
  const [scanDate, setScanDate] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [reloadCTcycle, setReloadCTcycle] = React.useState(false);
  const [urlHCcycle, setUrlHCcycle] = React.useState(decodeURIComponent(window.location.href.split('?')[1]?.split('=')[1])?.split("&")[0]);
  const [urlFilterProps, setUrlFilterProps] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[1]?.split('=')[1]));
  const [hcName, setHcName] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[2]?.split('=')[1]));
  const [asignedVoilations, setAsignedVoilations] = React.useState([]);
  let usedVoilation = []; 

  React.useEffect(() => {
    setLoader(true)
    UserService.getChangeTickets(urlHCcycle).then((results) => {
      let defaultRow = [{id: 0, type:'unassigned', risk: '', short_description: '', reason_for_change: '',assignment_group: '', unassigned_violations: urlFilterProps, violations: []}]
      if (results.status === 200) {
        setLoader(false)
        let changeTickts = results.data; 

        let totalAssignedVoilations = 0; 
        
        changeTickts.forEach(element => {
          totalAssignedVoilations += element.violations?.length; 
          element?.violations?.forEach(vioId => {
            usedVoilation.push(vioId.id); 
          });
        //  const allAssingedVoilations = [...asignedVoilations, ...element.violations];
          
        });
        console.log("usedVoilation", usedVoilation)

      //  setAsignedVoilations(usedVoilation);

        defaultRow[0].unassigned_violations =  parseInt(urlFilterProps) - totalAssignedVoilations;

      //  defaultRow.concat(changeTickts);
        const mergedRows = [...defaultRow, ...changeTickts];

        setRows(mergedRows);
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get HC API " + error);
    });
  }, [reloadCTcycle]);

  headCells[headCells.length-3].renderCell = (param) => {
    const currentRow = param.row;
    let vid = []; 
    currentRow.violations.forEach(element => {
      vid.push(element.id); 
    });
     
  
    let otherUsedVid = []; 
    usedVoilation.forEach(uid => {
      const found = vid.find(id => id === uid);
            
      if(found !== uid){
        otherUsedVid.push(uid);
      } 
    });

    let viewOnly = currentRow.type === "calibration"? 'ok' : "";

     return currentRow?.unassigned_violations > 0 ?   <Button size='small' title="Manage Voilations" variant="outlined" onClick={() => window.open("#/hc-details-view?hc="+urlHCcycle+"&f=violations"+"&vid=" + JSON.stringify(usedVoilation) )} >  {currentRow?.unassigned_violations} Violations </Button>: <div> 
       <Button size='small' title="Manage Voilations" variant="outlined" onClick={() => window.open("#/hc-details-view?hc="+urlHCcycle+"&f=violations"+"&vid=" + JSON.stringify(vid)+"&cid="+currentRow.id + "&uid="+ JSON.stringify(otherUsedVid) + "&vO=" + viewOnly )} >{currentRow?.violations?.length} Voilations </Button>
     </div>
  }

  headCells[headCells.length-2].renderCell = (param) => {
    const currentRow = param.row;
    return   currentRow?.unassigned_violations >= 0 ? '' : <div>  <CreateChangeRequest actionType={"Edit"}  currentRow={currentRow} urlHCcycle={urlHCcycle}/>  </div> 
  }

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

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
          <Typography color="primary" style={{padding: "5px"}}>  Change Request for {hcName}</Typography>
          </Grid>
        
          <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          <CreateChangeRequest actionType={"Create"} urlHCcycle={urlHCcycle} setReloadCTcycle={setReloadCTcycle} />
          </Grid>
        </Grid>

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
