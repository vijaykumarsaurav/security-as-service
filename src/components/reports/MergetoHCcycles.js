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

export default function CustomizedDialogs({setReloadHCcycle}) {

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [checkedScans, setCheckedScans] = React.useState([]);

    const [scans, setScans] = React.useState([]);

  
    const handleClickOpen = () => {
        setOpen(true);
        setName(''); 
        setDesc('')
        setCheckedScans([]); 

        UserService.getScannedDates().then((results) => {
            if (results.status === 200) {
               console.log("results", results.data);
              setScans(results.data);
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
            "scans": checkedScans
        }
        
        UserService.createHCCycle(param).then((results) => {
            setReloadHCcycle(true);
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
            <Button size='mediam' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
               Create new HC cycle
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              //  size="small"
                 fullWidth
                
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                 Create new HC cycle
                </BootstrapDialogTitle>
                <DialogContent dividers>

                    <TextField
                    variant='standard'
                    id="outlined-name"
                    label="Name"
                    value={name}
                    required
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <TextField
                    fullWidth
                     variant='standard'
                    id="outlined-uncontrolled"
                    label="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    multiline
                    rows={2}
                    />
                    <br />
                    Scan Dates*: 
                    {scans?.map((scan) => {
                        return (
                            <div>
                                
                             <FormGroup>
                                <FormControlLabel control={<Checkbox value={scan.id} onChange={handleCheckbox} />} label= {`${new Date(scan.date).toLocaleString()} (Job #${scan.jobId})`  }  />
                            </FormGroup>
                            </div>
                        );
                    })}

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
