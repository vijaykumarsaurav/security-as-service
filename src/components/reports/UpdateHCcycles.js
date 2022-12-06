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
import moment from 'moment';

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

export default function CustomizedDialogs({currentRow, setReloadHCcycle, setReloadScanApi}) {

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(currentRow.name);
    const [desc, setDesc] = React.useState(currentRow.description);
    const [checkedScans, setCheckedScans] = React.useState([]);

    const [scans, setScans] = React.useState([]);
    const [dueDate, setDueDate] = React.useState( moment(currentRow.dueDate).format('YYYY-MM-DD')   );
    const [assignee, setAssignee] = React.useState(currentRow.assignee);

    const getPolicies = (policies) => {
        if(policies.length){ 
            let allPolicies = [];
            console.log("policies table", policies)
            policies?.forEach(element => {
              let found = allPolicies.filter(name => name == element.name); 
              console.log("found", found)
              if(!found.length){
                let policyName = element.name.split('-'); 
                allPolicies.push(`${policyName[0]} ${policyName[1]} v${policyName[3]}`);
              }
            });
            return allPolicies; 
        }
       
    }
       

    const handleClickOpen = () => {
        setOpen(true);

        let scansList = []; 
        currentRow?.scans?.forEach(element => {
            element.defaultChecked = true; 
            if(element?.policies)
            element.policies = getPolicies(element.policies).join();
            scansList.push(element); 
        });  
        console.log("scansList",scansList )

        UserService.getScannedDates().then((results) => {
            if (results.status === 200) {
               console.log("results", results.data);
               for (let index = 0; index < results.data.length; index++) {
                const element = results.data[index];
                element.policies = getPolicies(element.policies).join();
                scansList.push(element); 
               }
               setScans(scansList); 
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });
    };
    // React.useEffect(()=> {
        

    // },[ open ])
    const handleClose = () => {
        setOpen(false);
        setName(''); 
        setDesc('')
        setCheckedScans([]); 
        setDueDate('')
        setAssignee('')
    };
    const handleSubmit = () => {

        if(checkedScans.length === 0){
            alert("No scan selected!")
            return;
        }
        let data = {
            "name": name,
            "description": desc,
            "scans": checkedScans,
            "dueDate": dueDate,
            "assignee": assignee
          }
        UserService.updateHCCycle(currentRow?.id, data).then((results) => {
            let data = results.data; 
            if (data.ok) {
                setReloadHCcycle(true);
                setReloadScanApi(true)
                alert(data.message);
                

              // console.log("results", results.data);
              window.location.reload(true)
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


    React.useEffect(() => {
        let defaultChecked = []; 
        currentRow?.scans?.forEach(element => {
            defaultChecked.push(element.id); 
        });  
        setCheckedScans(defaultChecked); 
    }, [currentRow])

    console.log('defaultChecked', scans )
  
    
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
                 {currentRow.name}
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
                    Scan Dates * 
                    {scans?.map((scan) => {
                        return (
                            <div>
                                
                             <FormGroup>
                                <FormControlLabel  control={<Checkbox defaultChecked={scan.defaultChecked} value={scan.id} onChange={handleCheckbox} />} label= {`${new Date(scan.date).toLocaleString()} (Job #${scan.jobId}) ${scan.policies}`  }  />
                            </FormGroup>
                            </div>
                        );
                    })}

                
                <TextField  
                type="date"
                variant='standard'
                InputLabelProps={{
                    shrink: true,
                  }}
                required 
                label="Due Date:"
                value={dueDate}              
                onChange={(e) => setDueDate(e.target.value)}
                />
                
              
                <TextField
                    variant='standard'
                    id="outlined-name"
                    label="Assignee Name"
                    value={assignee}
                    required
                    fullWidth
                    onChange={(e) => setAssignee(e.target.value)}
                    />


                {/* <TextField
                    variant='standard'
                    id="outlined-name"
                    label="Status"
                    value={status}
                    required
                    fullWidth
                    onChange={(e) => setStatus(e.target.value)}
                    /> */}
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
