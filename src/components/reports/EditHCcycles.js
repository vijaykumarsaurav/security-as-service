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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

export default function CustomizedDialogs({currentRow, setReloadHCcycle}) {

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [checkedScans, setCheckedScans] = React.useState([]);

    const [scans, setScans] = React.useState([]);
    const [dueDate, setDueDate] = React.useState(new Date());
    const [assignee, setAssignee] = React.useState('');

  
    const handleClickOpen = () => {
        setOpen(true);
        setName(''); 
        setDesc('')
        setCheckedScans([]); 
        setDueDate('')
        setAssignee('')

        // let defaultChecked = []; 
        // currentRow?.scans?.forEach(element => {
        //     defaultChecked.push(element.id); 
        // });  
        // setCheckedScans(defaultChecked); 

        // UserService.getScannedDates().then((results) => {
        //     if (results.status === 200) {
        //        console.log("results", results.data);
        //       setScans(results.data);
        //     }
        //   }).catch((error) => {
        //     console.log("error", error)
        //     Notify.showError("Error" + error); 
        //   });
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        UserService.deleteScanfromHCCycle(currentRow?.id, checkedScans).then((results) => {
            let data = results.data; 
            if (data.ok) {
                alert(data.message);
                setReloadHCcycle(true);
              // console.log("results", results.data);
              Notify.showSuccess("Selected scans deleted successfully from the HC cycles"); 
             
              setOpen(false);
            }
          }).catch((error) => {
            console.log("error", error)
            alert(error);

            Notify.showError("Error" + error); 
          });

        
    };
    const handleCheckbox = (event) => {

        if(event.target.checked){
            console.log(checkedScans.includes(event.target.value))
            if(!checkedScans.includes(event.target.value)){
                checkedScans.push(event.target.value)
            }
        }else {
            var index = checkedScans.findIndex(data => data === event.target.value)
            checkedScans.splice(index, 1);
        }
        console.log(event.target.checked, event.target.value , checkedScans)
        console.log('checkedScans', checkedScans)

        setCheckedScans(checkedScans); 
      };


    // React.useEffect(() => {
    //     let defaultChecked = []; 
    //     currentRow?.scans?.forEach(element => {
    //         defaultChecked.push(element.id); 
    //     });  
    //     setCheckedScans(defaultChecked); 
    // }, [])

    console.log('checkedScans', checkedScans)

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
                 Edit: {currentRow.name}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                  <b>Cycle Name:</b>  {currentRow.name} <br />
                  <b>Policies:</b> {currentRow.policies} <br />
                  <b>Scan Range:</b>  {currentRow.scanRange} <br />
                  <b>Status:</b> {currentRow.status} <br />

                  <br />
                  Selected scans will be deleted from the <b>{currentRow.name} </b>HC Cycle
                 
                    {currentRow?.scans?.map((scan) => {
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
