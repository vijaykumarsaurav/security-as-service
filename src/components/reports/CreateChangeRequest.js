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

export default function CustomizedDialogs({setReloadCTcycle, urlHCcycle}) {

    const [open, setOpen] = React.useState(false);
    const [desc, setDesc] = React.useState('');
    const [checkedScans, setCheckedScans] = React.useState([]);

    const [type, setType] = React.useState('');
    const [risk, setRisk] = React.useState('');
    const [shortDescription, setShortDescription] = React.useState('');
    const [reasonForChange, setReasonForChange] = React.useState('');
    const [assignmentGroup, setAssignmentGroup] = React.useState('');
 

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [showCheckSection, setShowCheckSection] = React.useState(false);
    const [checkSections, setCheckSections] = React.useState([]);
    const [checkSectionSelected, setCheckSectionSelected] = React.useState('');
    const [checkResults, setCheckResults] = React.useState([]);
    const [policyParamsKeyValue, setPolicyParamsKeyValue] = React.useState([]);

    const [regularExp, setRegularExp] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
        setDesc('')
        setCheckedScans([]); 
   
        UserService.getCycleDetails(urlHCcycle).then((results) => {
            if (results.status === 200) {
               console.log("results", results.data);

               let checks = results.data; 
               let checkRows = []; 

               checks.forEach(element => {
                    element?.checks?.forEach(check=> {
                        if(check?.check_section !== 'N/A' && !checkedScans.includes(check?.check_section)){
                            checkRows.push(check?.check_section)
                        }
                    });
               });

               setCheckSections(checkRows);
               setCheckResults(checks);
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });
    };
    const handleClose = () => {
        setOpen(false);
        setShowCheckSection(false);
        setPolicyParamsKeyValue([])
        setRegularExp('')
        setCheckSectionSelected('')
        setType('')
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
            "description": desc,
            "short_description": shortDescription,
            "reason_for_change": reasonForChange,
            "assignment_group": assignmentGroup,
            "violations": selectionModel,
            "health_check_cycle_id": urlHCcycle,

          }
        
        UserService.createChangeTicket(param).then((results) => {
            let data = results.data; 
            if (data.ok) {
                setReloadCTcycle(true)
                alert(data.message);
              // console.log("results", results.data);
              Notify.showSuccess("HC Cycle successfully created"); 
             
              setOpen(false);
            }
          }).catch((error) => {
            console.log("error", error)
            Notify.showError("Error" + error); 
          });

        
    };
    const handlePolicyParams = (e) => {
        
        let policyKeys = [...policyParamsKeyValue]; 
        
        policyKeys.forEach(element => {
            if(element.key === e.target.name) {
                element.value = e.target.value;
                return; 
            }
        });
        
        setPolicyParamsKeyValue(policyKeys);
        console.log(e.target.name, e.target.value,policyParamsKeyValue)
    };


    

    React.useEffect(() => {

        let policyParams = []; 
        checkResults?.forEach(element => {
            element?.checks?.forEach(check=> {
                if(check?.check_section === checkSectionSelected){
                    check.hosts?.forEach(host => {
                        host?.policy_parameters?.forEach(policyParameter => {
                            
                            let policyData = policyParameter?.split('='); 
                            if(policyData[1]){
                                let found = policyParams.filter(item => item.key == policyData[0]);
                                if(found.length == 0){
                                    policyParams.push({key : policyData[0], value : policyData[1]});
                                }

                            }
                        });
                    });
                }
            });
       });
       setPolicyParamsKeyValue(policyParams)

    }, [checkSectionSelected])


    // React.useEffect(()=> {

    //     setPolicyParamsKeyValue(policyParamsKeyValue);

    // }, [policyParamsKeyValue])

      console.log("policyParamsKeyValue", policyParamsKeyValue);

    return (
        <div>
            <Button size='size' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
               Create Change Ticket
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              //  size="small"
                 fullWidth
                
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Create Change Ticket
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
                    onChange={(e) => {
                        setType(e.target.value);

                        if(e.target.value  === 'calibration'){
                            setShowCheckSection(true);
                        }else{
                            setShowCheckSection(false);
                            setPolicyParamsKeyValue([])
                            setRegularExp('')
                            setCheckSectionSelected('')
                        }
                       
                    } }
                    > 
                     <MenuItem value={'remediation'}>Remediation</MenuItem>
                     <MenuItem value={'suppression'}>Suppression</MenuItem>
                     <MenuItem value={'calibration'}>Calibration</MenuItem>
                     <MenuItem value={'false positive'}>False Positive</MenuItem>

                    </Select>
                </FormControl>

               {showCheckSection?  <React.Fragment> <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Check Section</InputLabel>
                    <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    required
                    value={checkSectionSelected}
                    title="Check Section"
                    variant='standard'
                    label="Check Section"
                    onChange={(e) => setCheckSectionSelected(e.target.value)}
                    >
                    {checkSections?.map((item, i) => {
                        return (
                            <MenuItem value={item}>{item}</MenuItem>
                        );
                    })}
                    
                     </Select>

                </FormControl> 
                
                <FormControl sx={{ m: 1 }}  size="mediam">
                <TextField
                variant='standard'
                id="outlined-name"
                title='Hostname Regular Expression'
                label="Hostname Regular Expr."
                value={regularExp}
                required
                onChange={(e) => setRegularExp(e.target.value)}
                />
                </FormControl></React.Fragment> 

                : "" }

              
               
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
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
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


                    {type === "calibration" ? "Policy Parameters:" : ""}   <br />
                   
                    {policyParamsKeyValue?.map((element) => {
                        return (
                         <span  style={{marginBottom: '-5px'}} >  
                            <InputLabel>{element?.key}: 
                            &nbsp;

                            <TextField
                            variant='standard'
                            id="outlined-name"
                           // label="Value"
                            style={{marginTop: '-5px'}}
                            name={element?.key}
                            value={element?.value}
                            onChange={handlePolicyParams}
                            />
                            </InputLabel>
                          </span>  
                        );
                    })}


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
              

                <VoilationTable rows={violationList} loader={loader} setSelectionModel={setSelectionModel} />
 */}

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
