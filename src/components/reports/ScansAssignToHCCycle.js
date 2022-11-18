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
import moment from 'moment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

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

export default function CustomizedDialogs({setReloadScanApi, scansRows, selectionModel, hcrows}) {

    const [open, setOpen] = React.useState(false);
    const [selectHealthCheck, setSelectHealthCheck] = React.useState('');

    const handleClickOpen = () => {
        // if(!selectionModel.length){
        //     alert("Select scans to assign HC cycle");
        //     return;
        // }
        setOpen(true);
        setSelectHealthCheck(''); 
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        if(!selectHealthCheck){
            alert("Select a Health Check!"); 
            return; 
        }
        if(!selectionModel.length){
            alert("Required some scans to assign on HC !"); 
            return;  
        }
        UserService.addToHCCycle(selectHealthCheck, selectionModel).then((results) => {
          
            let data = results.data; 
            if (data.ok) {
                alert(data.message);
                setOpen(false);
                setReloadScanApi(true);
              // console.log("results", results.data);
              Notify.showSuccess("HC Cycle successfully created"); 
             
      
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });
    };
      
    const handleChange = (event) => {
        setSelectHealthCheck(event.target.value); 
    };

    const getScanData =(scanid)=> {
     let found = scansRows.filter(item => item.id == scanid); 
        if(found.length){
           
           return (<TableRow> 
                <TableCell>{found[0].jobId} </TableCell>
                <TableCell>{found[0].name} </TableCell>
                <TableCell>{moment(found[0].date).format('DD-MM-YYYY hh:mm A')} </TableCell>
            </TableRow>)
           // return `${found[0].jobId} ${found[0].name} ${moment(found[0].date).format('DD-MM-YYYY hh:mm A')}`; 
        }
        else 
        return ''; 
    }
      console.log('selectHealthCheck', selectHealthCheck)
    return (
        <div>
            <Button size='size' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
               Assign to HC cycle
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              //  size="small"
                 fullWidth
                
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                   Assign to HC cycle
                </BootstrapDialogTitle>
                <DialogContent dividers>

                    <Typography color={'primary'}> 
                    Selelcted Scans  </Typography> 
                

                    <Table size="small"  aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell> Job Id</TableCell>
                            <TableCell>Ansible Job</TableCell>
                            <TableCell>Scan Date</TableCell>
                        </TableRow>
                        </TableHead>
               
                    <TableBody> 
                    
                    {selectionModel?.map((scanid) => {
                        return getScanData(scanid)
                    })}
                    </TableBody>
                </Table>

                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Select HC</InputLabel>
                    <Select
                
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={selectHealthCheck}
                    title="Health Check cycles"
                    label="HC cycles"
                    onChange={handleChange}
                    > 
                    {hcrows.length ? hcrows?.map((item, i) => {
                        return (
                        <MenuItem value={item.id}>{item.name}</MenuItem>
                        );
                    }) : ""}
                    </Select>
                </FormControl>

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
