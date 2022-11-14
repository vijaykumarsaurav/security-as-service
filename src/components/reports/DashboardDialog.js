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
import UserService from '../service/UserService';
import Notify from '../utils/Notify';
import DataTable from './DataTable';
import Tooltip from '@mui/material/Tooltip';

import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarDensitySelector,
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

const columnsList = [
    {
      field: 'id',
      numeric: false,
      width: 80,
      sortable: true,
      editable: true,
      headerName: 'Sr.',
    //   renderCell:(index) => index, 
    //   valueGetter: (params) =>
    //   `${params.row || ''}`,
    },
    {
      field: 'name',
      numeric: true,
      minWidth: 300,
      maxWidth: 500,

      sortable: true,
      editable: true,
      headerName: 'Name',
      renderCell: (param) => {
        const currentRow = param.row;
        return <Tooltip placement="bottom" title={currentRow?.name}>
        <span> {currentRow?.name}</span>
      </Tooltip>
      }
    },
   
  ];

  
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

export default function CustomizedDialogs({id,  count, title}) {

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [checkedScans, setCheckedScans] = React.useState([]);
    const [loader, setLoader] = React.useState(false);

    const [scans, setScans] = React.useState([]);

  
    const handleClickOpen = () => {
        setOpen(true);
        setName(''); 
        setDesc('')
        setCheckedScans([]); 
        setLoader(true)

        UserService.getCycleDetails(id).then((results) => {
            if (results.status === 200) {
               console.log("results", results.data);
              
              if(title == 'Violations'){
                findViolations(results.data?.[0]?.checks)  
              }

              if(title == 'Checks'){
                findChecks(results.data?.[0]?.checks)  
              }
              if(title == 'Hostnames'){
                findHostnames(results.data?.[0]?.checks)  
              }
              setLoader(false)
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });
    };

    const findViolations = (checks) => {
        let violationsList = []; 
        for (let index = 0; index < checks.length; index++) {
            const element = checks[index];
            element?.hosts.forEach(host => {
                host?.violations?.forEach((violation, i) => {
                    violationsList.push({name : violation.message, id: violationsList.length+1} );
                  })
            });
        }
        setScans(violationsList);
    };

    const findChecks = (checks) => {
        let checksList = []; 
        for (let index = 0; index < checks.length; index++) {
            const element = checks[index];
            checksList.push({name : element.check_description, id: checksList.length+1} );
        }
        setScans(checksList);
    };

    const findHostnames = (checks) => {
        let hostnamesList = []; 
        for (let index = 0; index < checks.length; index++) {
            const element = checks[index];
            element?.hosts.forEach(host => {
                
                let found = hostnamesList.filter(item => item.name == host.hostname); 
                if(!found.length){
                    hostnamesList.push({name : host.hostname, id: hostnamesList.length+1} );
                }
            });
        }
        setScans(hostnamesList);
    };
    

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {

        if(!name){
            alert("Name can't be empty!"); 
            return; 
        }
        if(checkedScans?.length === 0){
            alert("Select the scans!"); 
            return; 
        }
        
        let param = {
            "name": name,
            "description": desc,
            "scans": checkedScans, 
            "dueDate":"2022-10-10T07:57:15.000+00:00",
            "assignee":"Dima"
        }
        
        UserService.createHCCycle(param).then((results) => {
            // setReloadHCcycle(true);
            alert('HC Cycle successfully created');
            if (results.status === 200) {
              // console.log("results", results.data);
              Notify.showSuccess("HC Cycle successfully created"); 
             
              setOpen(false);
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });

        
    };
    const handleCheckbox = (event) => {
        console.log(event.target)
        if(event.target.checked){
            if(!checkedScans.filter(item => item == event.target.value).length){
                checkedScans.push(event.target.value)
            }
        }else {
            var index = checkedScans.findIndex(data => data === event.target.value)
            checkedScans.splice(index, 1);
        }

        setCheckedScans(checkedScans); 
      };

    return (
        <div>
            {/* <Button size='size' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
               Create new HC cycle
            </Button> */}
            <Button size='small' variant="outlined" href="#/dashboard" onClick={handleClickOpen}>{count}</Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              //  size="small"
                 fullWidth
                
            >
                <BootstrapDialogTitle color="primary"  id="customized-dialog-title" onClose={handleClose}>
                 {title} ({scans.length})
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {/* {scans?.map((item, i) => {
                        return (
                            <div>
                            {`${i+1}. ${item.name}`  } 
                            </div>
                        );
                    })} */}

                <DataTable rows={scans} columns={columnsList}/>
                </DialogContent>
                <DialogActions> 
                {/* contained */}
                    {/* <Button variant="outlined" color="secondary"   onClick={handleClose}>
                        Cancel
                    </Button> */}
                    {/* <Button variant="outlined"  color="primary"   onClick={handleSubmit}>
                        Submit
                    </Button> */}
                    <Button variant="outlined"  autoFocus onClick={handleClose}>
                        Okey
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
