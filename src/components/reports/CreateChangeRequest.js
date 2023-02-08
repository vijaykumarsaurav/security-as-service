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
import Autocomplete from '@mui/material/Autocomplete';

import UserService from '../service/UserService';
import Notify from '../utils/Notify';
import { Select,FormControl, InputLabel, MenuItem, Table, TableHead, TableBody,TableRow, TableCell } from '@mui/material';
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

export default function CustomizedDialogs({setReloadCTcycle, urlHCcycle, actionType, currentRow}) {

    const [open, setOpen] = React.useState(false);
    const [desc, setDesc] = React.useState(currentRow?.description);
    const [checkedScans, setCheckedScans] = React.useState([]);

    const [type, setType] = React.useState(currentRow?.type);
    const [risk, setRisk] = React.useState(currentRow?.risk);
    const [shortDescription, setShortDescription] = React.useState(currentRow?.short_description);
    const [reasonForChange, setReasonForChange] = React.useState(currentRow?.reason_for_change);
    const [assignmentGroup, setAssignmentGroup] = React.useState(currentRow?.assignment_group);
 

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [showCheckSection, setShowCheckSection] = React.useState(currentRow?.type === "calibration" ? true : false);
    const [checkSections, setCheckSections] = React.useState([]);
    const [checkSectionSelected, setCheckSectionSelected] = React.useState(currentRow?.calibration?.section);
    const [checkResults, setCheckResults] = React.useState([]);
    const [policyParamsKeyValue, setPolicyParamsKeyValue] = React.useState([]); 
    const [policyParamsForSubmit, setPolicyParamsForSubmit] = React.useState([]);

    const [selectedVoilation, setSelectedVoilation] = React.useState(currentRow?.violations);
    const [selectedVoilationByHostname, setSelectedVoilationByHostname] = React.useState([]);

    const [priority, setPriority] = React.useState(currentRow?.calibration?.priority);
    const [policy, setPolicy] = React.useState(currentRow?.calibration?.policy);

    const [regularExp, setRegularExp] = React.useState(currentRow?.calibration?.pattern || '.*.');
    const [suppressionRegularExp, setSuppressionRegularExp] = React.useState('.*.');

    console.log("currentRow", currentRow, "actionType", actionType)
    const handleClickOpen = () => {
       
        setCheckedScans([]); 

        if (actionType === "Create"){
            setReasonForChange('');
            setShortDescription('')
            setAssignmentGroup('')
            setRisk('')
            setType('')
            setDesc('')
            setShowCheckSection(false)
        }
   
         setOpen(true);
            UserService.getCycleDetails(currentRow?.health_check_cycle_id || urlHCcycle).then((results) => {
                if (results.status === 200) {
                   console.log("results", results.data);
    
                   let checks = results.data; 
                   let checkRows = []; 
    
                   checks.forEach(element => {
                        element?.checks?.forEach(check=> {
                            if(check?.check_section !== 'N/A' && !checkedScans.includes(check?.check_section)){
    
                                let addFlag = false; 
                                check?.hosts?.forEach(host => {
                                    host?.policy_parameters?.forEach(policyParameter => {
                                        if(policyParameter.split("=")[1]){
                                            addFlag = true;
                                            return; 
                                        }
                                    }); 
                                });
                                if (addFlag){
                                    checkRows.push(check?.check_section)
                                }
                            }
                        });
                   });
                   checkRows?.sort();

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
        // setShowCheckSection(false);
        // setPolicyParamsKeyValue([])
        // setRegularExp('')
        // setCheckSectionSelected('')
        // setType('')
    };
    const handleSubmit = () => {

        if(!type){
            alert("Select Type!"); 
            return; 
        }
        if(type  === 'calibration' && !regularExp){
            alert("Type regular expression for hostname!"); 
            return; 
        }
        if(type !== 'false positive' && !risk){
            alert("Select Risk!"); 
            return; 
        }
        if(!shortDescription){
            alert("Type some Short Description!"); 
            return; 
        }
        if(type !== 'false positive' && !reasonForChange){
            alert("Type Reason For Change!"); 
            return; 
        }
      
        console.log('selectedVoilation', selectedVoilation)

        let param = {
            "type": type,
            "risk": risk,
            "description": desc,
            "short_description": shortDescription,
            "reason_for_change": reasonForChange,
            "assignment_group": assignmentGroup,
            "health_check_cycle_id": currentRow?.health_check_cycle_id || urlHCcycle,
            "violations": selectedVoilation?.map( object => object.violation?.id) 
            , 
            // "calibration": {
            // "pattern": regularExp,    
            // "priority": priority,
            // "section": checkSectionSelected, 
            // "policy": policy,
            // "policyParameters": policyParamsForSubmit
            // }
          }

          if(type  === 'calibration'){
            param.calibration = {
                "pattern": regularExp,    
                "priority": priority,
                "section": checkSectionSelected, 
                "policy": policy,
                "policyParameters": policyParamsForSubmit
            }
          }
          if(type  === 'suppression' || type  === 'false positive'){
            param.suppression = {
                "pattern": regularExp,    
                "priority": priority,
                "section": checkSectionSelected, 
                "policy": policy,
                "violation": suppressionRegularExp,
                "type": "string",
               
            }
            if (type  === 'false positive'){
                param.suppression.type = "False Positive"
            }
          }
        if(actionType === 'Create'){
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
                console.log("error", error.response.data?.message)
                alert(error.response.data?.message);
                Notify.showError("Error" + error); 
              });
        }else{

            UserService.updateChangeTicket(currentRow?.id, param).then((results) => {
                let data = results.data; 
                if (data.ok) {
                    alert(data.message);
                  setOpen(false);
                  window.location.reload(true)
                }
              }).catch((error, message) => {
                console.log("error", error, message?.message)
                alert(error.response.data?.message);
                Notify.showError("Error" + error); 
              });
        }
        
    };
    const handlePolicyParams = (e) => {
        
        let policyKeys = [...policyParamsKeyValue]; 
        console.log(e.target.name, e.target.value)

        policyKeys.forEach(element => {
            if(element.name === e.target.name) {
                element.value = e.target.value;
                return; 
            }
        });

        setPolicyParamsKeyValue(policyKeys);
       // setPolicyParamsForSubmit(policyKeys)
    };

    React.useEffect(() => {

        let policyParams = [], selectedVoilations = []; 
        checkResults?.forEach(element => {
            element?.checks?.forEach(check=> {
                if(check?.check_section === checkSectionSelected){
                    setPolicy(element.policy); 
                    check.hosts?.forEach(host => {
                        host?.policy_parameters?.forEach(policyParameter => {
                            let policyData = policyParameter?.split('='); 
                            if(policyData[1]){
                                let found = policyParams.filter(item => item.name == policyData[0]);
                                
                                let value = ''; 
                                if(found.length > 0){
                                    if(policyData[0] === found[0].name && policyData[1] === found[0].value) {
                                        value = policyData[1]; 
                                    }
                                }else{
                                    value = policyData[1];   
                                }

                                if(found.length == 0){
                                    policyParams.push({name: policyData[0], value : value, type: typeof value});
                                }
                            }
                        });
                        
                        console.log('regularExp?', regularExp)
                        if(regularExp?.charAt(0) == '.'){ 
                            const reg = new RegExp(regularExp, "g");
                            if(host?.hostname?.match( reg )){
                                host?.violations?.forEach(violation => {                            
                                    let found = selectedVoilations.filter(item => item.id == violation.id);
                                           if(found.length == 0){
                                               selectedVoilations.push({ hostname : host?.hostname, violation: violation} );
                                           }
                                   });
                            }
                        }
                        
                      
                    });

                }
            });
       });

       setPolicyParamsKeyValue(policyParams)
       console.log("after caluclation vol",selectedVoilations)

       if(type === 'calibration'){
        setSelectedVoilation(selectedVoilations)
       }
       setSelectedVoilationByHostname(selectedVoilations)

    }, [checkSectionSelected,  regularExp])

    React.useEffect(() => {
        let selectedVoilations = []; 
        if(suppressionRegularExp?.charAt(0) == '.'){ 
            const regv = new RegExp(suppressionRegularExp, "gi");
          
            selectedVoilationByHostname?.forEach(violationRow => {   

                    console.log('violationRow?.violation?.message?.match( regv )', violationRow?.violation?.message?.match( regv ))
                    if(violationRow?.violation?.message?.match( regv )){
                        selectedVoilations.push(violationRow);

                    }
                });
        }
        setSelectedVoilation(selectedVoilations)
        console.log('suppressionRegularExp?', suppressionRegularExp, 'selectedVoilations', selectedVoilations, 'selectedVoilationByHostname', selectedVoilationByHostname)

    }, [suppressionRegularExp, selectedVoilationByHostname])


    React.useEffect(()=> {
        console.log("setPolicyParamsKeyValue", currentRow)
        setPolicyParamsKeyValue(currentRow?.calibration?.policyParameters); 
        setShowCheckSection(currentRow?.type === "calibration" || currentRow?.type === "suppression" || currentRow?.type === "false positive" ? true : false)

        if(currentRow?.type === 'calibration'){
            setCheckSectionSelected(currentRow?.calibration?.section)  
            setPriority(currentRow?.calibration?.priority)
            setPolicy(currentRow?.calibration?.policy)
            setRegularExp(currentRow?.calibration?.pattern)

            console.log('currentRow?.calibration?.policyParameters', currentRow?.calibration?.policyParameters)

        }else if(currentRow?.type === 'suppression' || currentRow?.type === 'false positive'){

            if(currentRow?.type === 'false positive'){
                console.log('false positive', currentRow?.suppression)
            }
            setCheckSectionSelected(currentRow?.suppression?.section)  
            setPriority(currentRow?.suppression?.priority)
            setPolicy(currentRow?.suppression?.policy)
            setRegularExp(currentRow?.suppression?.pattern)
            setSuppressionRegularExp(currentRow?.suppression?.violation)
        }
    }, [currentRow])

    React.useEffect(()=> {
        console.log("currentRow?.violations", currentRow?.violations)
        let policyParams = [], existingVoilations = []; 
        checkResults?.forEach(element => {
            element?.checks?.forEach(check=> {
                check.hosts?.forEach(host => {
                        
                    host?.violations?.forEach(violation => {                            
                        let found = currentRow?.violations.filter(item => item.id == violation.id);
                               if(found?.length > 0){
                                existingVoilations.push({ hostname : host?.hostname, violation: violation} );
                               }
                       });
                    
                  
                });
            });
       });

       setSelectedVoilation(existingVoilations)
       console.log("after caluclation vol existingVoilations",existingVoilations )

    }, [checkResults, currentRow?.violations])


    React.useEffect(()=> {
        let tPcopy = [];  
        policyParamsKeyValue?.forEach(element => {
            tPcopy.push({ name: element.name, value: element.value, type: typeof element.value})
        });

        console.log("tPcopy", tPcopy)
        setPolicyParamsForSubmit(tPcopy);
    }, [policyParamsKeyValue])

      console.log("policyParamsForSubmit", policyParamsForSubmit);

    return (
        <div>
            <Button size='size' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
              
               {actionType === 'Edit' ?  <EditIcon fontSize="small"  /> : "Create Change Ticket"} 
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              //  size="small"
                 fullWidth
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                {actionType} Change Ticket
                </BootstrapDialogTitle>
                <DialogContent dividers>
        
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Type *</InputLabel>
                    <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    required
                    disabled={actionType === 'Edit' &&  (type === 'calibration' || type === 'suppression' || type === 'false positive') ? true : false}
                    value={type}
                    title="Type"
                    variant='standard'
                    label="Type"
                    onChange={(e) => {
                        setType(e.target.value);

                        if(e.target.value  === 'calibration' || e.target.value  === 'suppression' || e.target.value === 'false positive'){
                            setShowCheckSection(true);
                            setCheckSectionSelected('')
                        }else{
                            setShowCheckSection(false);
                            setPolicyParamsKeyValue([])
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

               {showCheckSection? <React.Fragment> 
                
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">

                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={checkSections}
                    sx={{ width: 150 }}
                    value={checkSectionSelected}

                    onChange={(event, newValue) => {
                        console.log('newvalue', newValue)
                        setCheckSectionSelected(newValue)
                      }}

                    renderInput={(params) => <TextField  variant="standard"  {...params} label="Check Section" />}
                    />
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
                </FormControl>
                
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    {/* <InputLabel id="demo-select-small">Priority *</InputLabel> */}
                    <TextField
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={priority}
                    type={"number"}
                    required
                    title="Priority"
                    variant='standard'
                    label="Priority"
                    onChange={(e) => setPriority(e.target.value)}
                    /> 
                     {/* <MenuItem value={1}>1</MenuItem>
                     <MenuItem value={2}>2</MenuItem>
                     <MenuItem value={3}>3</MenuItem>
                     <MenuItem value={4}>4</MenuItem>
                     <MenuItem value={5}>5</MenuItem>
                    </Select> */}
                </FormControl>
                </React.Fragment> 

                : "" }

                {type === "suppression" || type  === 'false positive' ?  <FormControl sx={{ m: 1 }}  size="mediam">
                <TextField
                variant='standard'
                id="outlined-name"
                title='Voilation Regular Expression'
                label="Violation Regex."
                value={suppressionRegularExp}
                required
                onChange={(e) => setSuppressionRegularExp(e.target.value)}
                />
                </FormControl> : ""}

               {type  !== 'false positive' ? <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
                </FormControl> : ""} 


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
             
                    {type  !== 'false positive' ? <span> <TextField
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
                    /></span> 

                    : ""}
                    <br />  <br />

                    {type === "calibration" ? 
                        <span>
                                Policy Parameters:  <br />
                                {policyParamsKeyValue?.map((element, j) => {
                                    return (
                                    <span  style={{marginBottom: '-5px'}} >  
                                        <InputLabel>{j+1}. {element?.name}: 
                                        &nbsp;

                                        <TextField
                                        variant='standard'
                                        id="outlined-name"
                                    // label="Value"
                                        style={{marginTop: '-5px'}}
                                        name={element?.name}
                                        value={element?.value}
                                        onChange={handlePolicyParams}
                                        />
                                        </InputLabel>
                                    </span>  
                                    );
                                })}
                        </span>
                    
                     : ""}
                <br />
                {type === "calibration" || type === "suppression" || type  === 'false positive' ? <span>  Violations: 
                    <Table> <TableHead> 
                        <TableRow> 
                            <TableCell> 
                                Hostname
                            </TableCell>
                            <TableCell> 
                                Violation
                            </TableCell>
                        </TableRow>
                    </TableHead>  

                    <TableBody> 
                      
                    {selectedVoilation?.map((element, i) => {
                       return (

                        <TableRow> 
                            <TableCell>
                                {i+1}. {element?.hostname} 
                            </TableCell>
                        <TableCell> 
                            {element?.violation?.message}
                        </TableCell>
                    </TableRow>
               
                       );
                   })}
                    </TableBody>
                    </Table> </span> : ""} 
                
              
                {/* <VoilationTable rows={selectedVoilation}/> */}


                </DialogContent>

                {/* {selectedVoilation.length ? <span title={JSON.stringify(selectedVoilation, null, 2)}> {selectedVoilation.length + ' voilations passing on submit action'} </span>  : ""}  */}

                <DialogActions> 

                {/* contained */}
                    <Button variant="outlined" color="secondary"   onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                    // disabled={actionType === 'Edit' && type === 'calibration' ? true : false}
                    variant="outlined"  color="primary"   onClick={handleSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
