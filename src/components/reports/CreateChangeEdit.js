import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ExpandListItem from './ExpandListItem';
import VoilationTable from './VoilationTable';
import EditIcon from '@mui/icons-material/Edit';

import UserService from '../service/UserService';
import Notify from '../utils/Notify';
import { Select,FormControl, InputLabel, MenuItem } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport
  } from '@mui/x-data-grid';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const headCells = [
    {
      field: 'id',
      numeric: false,
      width: 150,
      sortable: true,
      editable: true,
      headerName: 'Id',
    },
    {
      field: 'message',
      numeric: true,
      width: 250,
      sortable: true,
      editable: true,
      headerName: 'Message',
    },
    
  ];

export default function CustomizedDialogs({ currentRow }) {

    const [open, setOpen] = React.useState(false);
    const [checkedScans, setCheckedScans] = React.useState([]);

    const [scans, setScans] = React.useState([]);
    const [dueDate, setDueDate] = React.useState(new Date());
    const [assignee, setAssignee] = React.useState('');

    const [type, setType] = React.useState(currentRow.type);
    const [risk, setRisk] = React.useState(currentRow.risk);
    const [changeId, setChangeId] = React.useState( currentRow.id );
    const [description, setDescription] = React.useState(currentRow.description);

    const [shortDescription, setShortDescription] = React.useState(currentRow.short_description);
    const [reasonForChange, setReasonForChange] = React.useState(currentRow.reason_for_change);
    const [assignmentGroup, setAssignmentGroup] = React.useState(currentRow.assignment_group);
    const [hcrows, setHcrows] = React.useState([]);
    const [selectedHC, setSelectedHC] = React.useState(currentRow.health_check_cycle_id);
    const [violationList, setViolationList] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [selectionModel, setSelectionModel] = React.useState(currentRow.violations);
    console.log("currentRowcurrentRow", currentRow, description);

    const [urlHCcycle, setUrlHCcycle] = React.useState(decodeURIComponent(window.location.href.split('?')[1]?.split('=')[1])?.split("&")[0]);

    const handleClickOpen = () => {
        setOpen(true);
       // setDesc('')
        // setCheckedScans([]); 
        // setDueDate('')
        // setAssignee('')

        UserService.getHCCycles().then((results) => {
            if (results.status === 200) {
               console.log("results", results.data);
               setHcrows(results.data);

               if(results.data?.length == 1){
                setSelectedHC(results.data[0].id);
               }
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {

        if(!type){
            alert("Select Type!"); 
            return; 
        }
        if(!risk){
            alert("Select Risk!"); 
            return; 
        }
        if(!shortDescription){
            alert("Type some Short Description!"); 
            return; 
        }
        if(!reasonForChange){
            alert("Type Reason For Change!"); 
            return; 
        }

        let param = {
            "type": type,
            "risk": risk,
            "description": description,
            "short_description": shortDescription,
            "reason_for_change": reasonForChange,
            "assignment_group": assignmentGroup,
//            "violations": selectionModel,
            "health_check_cycle_id": urlHCcycle,
          }
        
        UserService.updateChangeTicket(changeId, param).then((results) => {
            let data = results.data; 
            if (data.ok) {
                alert(data.message);
                Notify.showSuccess("HC Cycle successfully created"); 
              setOpen(false);
              window.location.reload(true)
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });

        
    };

      React.useEffect(() => {
        if(selectedHC){
            setLoader(true)
            UserService.getCycleDetails(selectedHC).then((results) => {
                if(results.status === 200){ 
                let checks =  results?.data[0]?.checks;
                let tempDevData = [];
                for (let index = 0; index < checks.length; index++) {
                    const element = checks[index];
                    element?.hosts.forEach(host => {
                    if (host.check_status === 'KO') {
                        host?.violations.forEach(violation => {
                        tempDevData.push(violation);
                        })
                    }
                    });
                }
                  setViolationList(tempDevData); 
                  setLoader(false)
                }
              }).catch((error)=> {
                console.log("error", error)
               // setRowsWait(false);
                alert("Error" + error);
          
              });
        }
       

      }, [selectedHC])

      console.log("setSelectionModel", selectionModel);

    return (
        <div>
            <Button size='size' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
            <EditIcon fontSize="small"  />
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              //  size="small"
                 fullWidth
                
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                   Edit Change Ticket
                </BootstrapDialogTitle>
                <DialogContent dividers>
        
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Type *</InputLabel>
                    <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    required
                    value={type}
                    title="Type"
                    variant='standard'
                    label="Type"
                    onChange={(e) => setType(e.target.value)}
                    > 
                     <MenuItem value={'remediation'}>Remediation</MenuItem>
                     <MenuItem value={'suppression'}>Suppression</MenuItem>
                     <MenuItem value={'calibration'}>Calibration</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Risk *</InputLabel>
                    <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={risk}
                    required
                    title="Risk"
                    variant='standard'
                    label="Risk"
                    onChange={(e) => setRisk(e.target.value)}
                    > 
                     <MenuItem value={'low'}>Low</MenuItem>
                     <MenuItem value={'medium'}>Medium</MenuItem>
                     <MenuItem value={'high'}>High</MenuItem>
                    </Select>
                </FormControl>

                    <TextField
                    variant='standard'
                    id="outlined-name"
                    label="Short Description"
                    value={shortDescription}
                    required
                    fullWidth
                    onChange={(e) => setShortDescription(e.target.value)}
                    />
                    <br />
                    <TextField
                    fullWidth
                     variant='standard'
                    id="outlined-uncontrolled"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={2}
                    />
                    <br />
             
                <TextField
                    variant='standard'
                    id="outlined-name"
                    label="Reason for change"
                    value={reasonForChange}
                    required
                    fullWidth
                    onChange={(e) => setReasonForChange(e.target.value)}
                    />
                <br />
                <TextField
                    variant='standard'
                    id="outlined-name"
                    label="Assignment Group"
                    value={assignmentGroup}
                    required
                    fullWidth
                    onChange={(e) => setAssignmentGroup(e.target.value)}
                    />
                    <br />  <br />
                {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Select Health Check Cycle</InputLabel>
                    <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={selectedHC}
                    title="Risk"
                    variant='standard'
                    label="Risk"
                    onChange={(e) => setSelectedHC(e.target.value)}
                    > 
                    
                     {hcrows?.map((cycle) => {
                        return (
                            <MenuItem value={cycle?.id}>{cycle?.name}</MenuItem>
                        );
                    })}
                    </Select>
                </FormControl>
                <br /> 
              

                <VoilationTable rows={violationList} loader={loader} setSelectionModel={setSelectionModel} /> */}


                </DialogContent>

                <DialogActions> 
                {/* contained */}
                    <Button variant="outlined" color="secondary"   onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined"  color="primary"   onClick={handleSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
