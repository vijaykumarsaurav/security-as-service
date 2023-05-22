import * as React from 'react';
import PropTypes from 'prop-types';

import { loginRedirect } from "../utils/AuthErrorHandler";
import moment from 'moment';

import UserService from '../service/UserService';
import Notify from '../utils/Notify';
import { FormControl, InputLabel, MenuItem , TextField} from '@mui/material';
import { Form, Stack, TextInput, TextArea, Button, Select, SelectItem, Checkbox, ComboBox, DatePicker, DatePickerInput, DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction, TableSelectAll, TableSelectRow, Pagination } from '@carbon/react';

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

export default function CreateUpdateException({ actionType, currentRow, selectedPolicy }) {

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
    const [checkSectionSelected, setCheckSectionSelected] = React.useState('');
    const [checkResults, setCheckResults] = React.useState([]);
    const [policyParamsKeyValue, setPolicyParamsKeyValue] = React.useState(currentRow?.policyParameters);

    const [selectedVoilation, setSelectedVoilation] = React.useState(currentRow?.violations);
    const [selectedVoilationByHostname, setSelectedVoilationByHostname] = React.useState([]);

    const [priority, setPriority] = React.useState(currentRow?.calibration?.priority);
    const [policy, setPolicy] = React.useState(currentRow?.calibration?.policy);

    const [regularExp, setRegularExp] = React.useState(currentRow?.calibration?.pattern || '.*');
    const [suppressionRegularExp, setSuppressionRegularExp] = React.useState('.*');
    const [changeTicketId, setChangeTicketId] = React.useState('');
    const [exclusionType, setExclusionType] = React.useState('');

    const [exceptionDescription, setExceptionDescription] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState('');
    const [nonExpiring, setNonExpiring] = React.useState(false);
    // setCheckResults(localStorage.getItem('policyScanData') ? JSON.parse(localStorage.getItem('policyScanData')) : []);


    const handleSubmit = () => {

        if (!priority) {
            alert("Set the Priority!");
            return;
        }
        if (type === 'calibration' && !regularExp) {
            alert("Type regular expression for hostname!");
            return;
        }

        if (type === 'valid deviation' && !exclusionType) {
            alert("Select Exclution type!");
            return;
        }

        if (actionType === 'Create') {
            let param = {};
            if (type === 'calibration') {
                param = {
                    "pattern": regularExp,
                    "priority": priority,
                    "section": checkSectionSelected,
                    "policy": selectedPolicy,
                    "active": true,
                    "policyParameters": policyParamsKeyValue,
                    "description": exceptionDescription,
                    "changeTiketNumber": changeTicketId,
                    "expirationDate": !nonExpiring ? expirationDate : null
                }
            }
            if (type === 'valid deviation') {
                param = {
                    "pattern": regularExp,
                    "priority": priority,
                    "type": exclusionType,
                    "policy": selectedPolicy,
                    "section": checkSectionSelected,
                    "violation": suppressionRegularExp,
                    "active": true,
                    "description": exceptionDescription,
                    "changeTiketNumber": changeTicketId,
                    "expirationDate": !nonExpiring ? expirationDate : null

                }
            }

            UserService.createCalibration(param, type).then((results) => {
                let data = results.data;
                console.log('ddd', data)
                if (data?.ok) {
                    alert(data?.message);
                    // console.log("results", results.data);
                    setOpen(false);
                    window.location.reload(true)
                }
            }).catch((error) => {
                if (error)
                    alert(error?.response?.data?.message);
                console.log("error", error?.response?.data?.message)
                //
            });
        } else {

            let param = {};
            if (type === 'calibration') {
                param = {
                    "pattern": regularExp,
                    "priority": priority,
                    "policyParameters": policyParamsKeyValue,
                    "description": exceptionDescription,
                    "changeTiketNumber": changeTicketId,
                    "expirationDate": !nonExpiring ? expirationDate : null
                }
            }
            if (type === 'valid deviation') {
                param = {
                    "pattern": regularExp,
                    "priority": priority,
                    "violation": suppressionRegularExp,
                    "description": exceptionDescription,
                    "type": exclusionType,
                    "changeTiketNumber": changeTicketId,
                    "expirationDate": !nonExpiring ? expirationDate : null
                }
            }

            UserService.updateCaliAndSupp(type, currentRow?.id, param).then((results) => {
                let data = results.data;
                if (data.ok) {
                    console.log("datadata", data)
                    alert(data.message);
                    setOpen(false);
                    window.location.reload(true)
                }
            }).catch((error, message) => {
                if (error)
                    alert(error?.response?.data?.message);
                console.log("error", error?.response?.data?.message)
                // 
            });
        }

    };
    const handlePolicyParams = (e) => {

        let policyKeys = [...policyParamsKeyValue];
        console.log(e.target.name, e.target.value)

        policyKeys.forEach(element => {
            if (element.name === e.target.name) {
                element.value = e.target.value;
                return;
            }
        });

        setPolicyParamsKeyValue(policyKeys);
    };

    React.useEffect(() => {
        let policyScanData = localStorage.getItem('policyScanData') ? JSON.parse(localStorage.getItem('policyScanData')) : [];

        if (actionType === "Create") {
            console.log('currentRowcurrentRowcurrentRow create', currentRow)

            setReasonForChange('');
            setShortDescription('')
            setAssignmentGroup('')
            setRisk('')
            setType('')
            setDesc('')
            setShowCheckSection(false)

            let checkRows = [];
            policyScanData?.forEach(element => {
                if (element?.check_section !== 'N/A' && !checkedScans.includes(element?.check_section)) {
                    let addFlag = false;
                    element?.hosts?.forEach(host => {
                        host?.policy_parameters?.forEach(policyParameter => {
                            if (policyParameter.split("=")[1]) {
                                addFlag = true;
                                return;
                            }
                        });
                    });
                    if (addFlag) {
                        checkRows.push({ id: element?.check_section, label: element?.check_section })
                    }
                }
            });
            checkRows?.sort();

            console.log('checksection', checkRows)
            setCheckSections(checkRows);
            setCheckResults(policyScanData);
            setOpen(true);
        } else if (actionType === "Edit") {
            setOpen(true);
            console.log('currentRowcurrentRowcurrentRow Edit', currentRow)

            setType(currentRow?.ticketType === "Calibration" ? "calibration" : "valid deviation")

            setCheckSectionSelected(currentRow?.section)
            setPriority(currentRow?.priority)
            setPolicy(currentRow?.policy)
            setRegularExp(currentRow?.pattern)
            setShowCheckSection(currentRow?.ticketType === "Calibration" || currentRow?.ticketType === "Suppression" ? true : false)
            setPolicyParamsKeyValue(currentRow?.policyParameters);
            setChangeTicketId(currentRow?.changeTiketNumber)
            setExceptionDescription(currentRow?.description)
            setExclusionType(currentRow?.type)
            setSuppressionRegularExp(currentRow?.violation)
                
            if(currentRow?.expirationDate){
                setExpirationDate(moment(currentRow?.expirationDate).format('YYYY-MM-DD'))
            }else {
                setNonExpiring(true)
            }
        }
    }, [])



    React.useEffect(() => {

        let policyParams = [], selectedVoilations = [];
        checkResults?.forEach(element => {
            if (element?.check_section === checkSectionSelected) {
                setPolicy(element.policy);
                element.hosts?.forEach(host => {
                    host?.policy_parameters?.forEach(policyParameter => {
                        let policyData = policyParameter?.split('=');
                        if (policyData[1]) {
                            let found = policyParams.filter(item => item.name == policyData[0]);

                            let value = '';
                            if (found.length > 0) {
                                if (policyData[0] === found[0].name && policyData[1] === found[0].value) {
                                    value = policyData[1];
                                }
                            } else {
                                value = policyData[1];
                            }

                            if (found.length == 0) {
                                policyParams.push({ name: policyData[0], value: value, type: typeof value });
                            }
                        }
                    });

                    console.log('regularExp?', regularExp)
                    if (regularExp?.charAt(0) == '.') {
                        const reg = new RegExp(regularExp, "g");
                        if (host?.hostname?.match(reg)) {
                            host?.violations?.forEach(violation => {
                                let found = selectedVoilations.filter(item => item.id == violation.id);
                                if (found.length == 0) {
                                    selectedVoilations.push({ hostname: host?.hostname, violation: violation });
                                }
                            });
                        }
                    }


                });

            }
        });

        if (actionType !== "Edit") {
            setPolicyParamsKeyValue(policyParams)
        }
        console.log("after caluclation vol", selectedVoilations)

        if (type === 'calibration') {
            setSelectedVoilation(selectedVoilations)
        }
        setSelectedVoilationByHostname(selectedVoilations)

    }, [checkSectionSelected, regularExp])

    React.useEffect(() => {
        let selectedVoilations = [];
        if (suppressionRegularExp?.charAt(0) == '.') {
            const regv = new RegExp(suppressionRegularExp, "gi");

            selectedVoilationByHostname?.forEach(violationRow => {

                console.log('violationRow?.violation?.message?.match( regv )', violationRow?.violation?.message?.match(regv))
                if (violationRow?.violation?.message?.match(regv)) {
                    selectedVoilations.push(violationRow);

                }
            });
        }
        setSelectedVoilation(selectedVoilations)
        console.log('suppressionRegularExp?', suppressionRegularExp, 'selectedVoilations', selectedVoilations, 'selectedVoilationByHostname', selectedVoilationByHostname)

    }, [suppressionRegularExp, selectedVoilationByHostname])

    React.useEffect(() => {
        console.log("currentRow?.violations", currentRow?.violations)
        let policyParams = [], existingVoilations = [];
        checkResults?.forEach(element => {
            element.hosts?.forEach(host => {

                host?.violations?.forEach(violation => {
                    let found = currentRow?.violations?.filter(item => item.id == violation.id);
                    if (found?.length > 0) {
                        existingVoilations.push({ hostname: host?.hostname, violation: violation });
                    }
                });


            });
        });

        setSelectedVoilation(existingVoilations)
        console.log("after caluclation vol existingVoilations", existingVoilations)

    }, [checkResults, currentRow?.violations])

    console.log("policyParamsKeyValue", policyParamsKeyValue);
    let setMandt =  exclusionType != "other" || type === 'calibration' ? '*' : ''; 

    return (
        <div>
            {/* <Button  disabled={dataLoader} style={{ marginTop: actionType !== "Edit" ? '10px': "", height:"34px"}}   title={actionType === 'Create' ? "Select a Policy to create a change ticket" : "Edit"}  variant="outlined" onClick={handleClickOpen}>
               {actionType === 'Edit' ?  <EditIcon style={{marginBottom:"1px"}} fontSize="small"  /> : "Create Exception"} 
            </Button> */}

            <Form>
                <Stack gap={7}>

                    {/* {JSON.stringify(currentRow)} */}

                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        required
                        disabled={actionType === 'Edit' && (type === 'calibration' || type === 'valid deviation') ? true : false}
                        value={type}
                        title="Type"
                        variant='standard'
                        labelText="Type"
                        onChange={(e) => {
                            setType(e.target.value);

                            if (e.target.value === 'calibration' || e.target.value === 'valid deviation') {
                                setShowCheckSection(true);
                                setCheckSectionSelected('')
                            } else {
                                setShowCheckSection(false);
                                setCheckSectionSelected('')
                            }

                        }}
                    >
                        <SelectItem text={'Select Type'} value={''} />
                        <SelectItem text={'Exclusion'} value={'valid deviation'} />
                        <SelectItem text={'Calibration'} value={'calibration'} />
                    </Select>

                    {showCheckSection ? <React.Fragment>

                        {type === "valid deviation" ?
                            <Select
                                value={exclusionType}
                                labelText="Exclusion Type *"
                                required
                                onChange={(e) => {
                                    setExclusionType(e.target.value)
                                }}
                            >
                                <SelectItem value={''} text={'Select Exclution Type'} />
                                <SelectItem value={'approved change ticket'} text={'Approved Change Ticket'} />
                                <SelectItem value={'non-compliance issue'} text={'Non-Compliance Issue'} />
                                <SelectItem value={'csd deviation'} text={'CSD Deviation'} />
                                <SelectItem value={'Risk Letter'} text={'Risk Letter'} />
                                <SelectItem value={'client managed'} text={'Client Managed'} />
                                <SelectItem value={'other'} text={'Other'} />
                            </Select>
                            : ""}


                        {/* <TextField
                                style={{ marginTop: "8px" }}
                                variant='standard'
                                id="outlined-name"
                                title={type === "calibration" ? "Change Ticket ID" : "Ticket/Document ID"}
                                label={type === "calibration" ? "Change Ticket ID" : "Ticket/Document ID"}
                                value={changeTicketId}
                                required={exclusionType != "other" || type === 'calibration' ? true : false}
                                onChange={(e) => setChangeTicketId(e.target.value)}
                            /> */}

                        <TextInput
                            required={exclusionType != "other" || type === 'calibration' ? true : false}
                            value={changeTicketId}
                            id="changeTicketId"
                            onChange={(e) => setChangeTicketId(e.target.value)}
                            invalidText="Invalid error message."
                            labelText={type === "calibration" ? "Change Ticket ID" +setMandt  : "Ticket/Document ID" + setMandt}

                        />

                        <div>
                            <ComboBox
                                ariaLabel="ComboBox"
                                id="CheckSection"
                                items={checkSections}
                                label="Combo box menu options"
                                titleText="Check Section"
                                size='lg'
                                value={checkSectionSelected}
                                fullWidth
                                disabled={actionType === "Edit" ? true : false}
                                onChange={({ selectedItem }) => setCheckSectionSelected(selectedItem?.id)}

                            // {(event, newValue) => {
                            //     console.log('newvalue', newValue)
                            //     setCheckSectionSelected(newValue)
                            // }}
                            />
                        </div>

                        {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">

                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={checkSections}
                                sx={{ width: 150 }}
                                value={checkSectionSelected}
                                disabled={actionType === "Edit" ? true : false}
                                onChange={(event, newValue) => {
                                    console.log('newvalue', newValue)
                                    setCheckSectionSelected(newValue)
                                }}

                                renderInput={(params) => <TextField variant="standard"  {...params} label="Check Section" />}
                            />

                        </FormControl> */}

                        <TextInput
                            id="regularExp"
                            value={regularExp}
                            required
                            onChange={(e) => setRegularExp(e.target.value)}
                            invalidText="Invalid error message."
                            labelText={'Hostname Regular Expression *'}
                        />

                        {/* <FormControl sx={{ m: 1 }} size="mediam">
                            <TextField
                                style={{ marginTop: "8px" }}
                                variant='standard'
                                id="outlined-name"
                                title='Hostname Regular Expression'
                                label="Hostname Regular Expr."
                                value={regularExp}
                                required
                                onChange={(e) => setRegularExp(e.target.value)}
                            />
                        </FormControl> */}

                        <TextInput
                            id="regularExp"
                            value={priority}
                            type={"number"}
                            required
                            onChange={(e) => setPriority(e.target.value)}
                            invalidText="Invalid error message."
                            labelText={'Priority *'}
                        />


                        {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <TextField
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={priority}
                               
                                required
                                title="Priority"
                                variant='standard'
                                label="Priority"
                                onChange={(e) => setPriority(e.target.value)}
                            />
                         
                        </FormControl> */}


                    </React.Fragment>

                        : ""}

                    {type === "valid deviation" ?
                        <TextInput
                            variant='standard'
                            id="outlined-name"
                            title='Voilation Regular Expression'
                            label="Violation Regular Expr"
                            labelText={'Voilation Regular Expression'}
                            value={suppressionRegularExp}
                            required
                            onChange={(e) => setSuppressionRegularExp(e.target.value)}
                        /> : ""}


                    {type === "valid deviation" || type === "calibration" ?
                        <React.Fragment>

                            <fieldset className="cds--fieldset">
                                <Checkbox labelText="Is Non-Expiring ?" id="nonExpiring"
                                    value={nonExpiring}
                                    defaultChecked={nonExpiring}
                                    onChange={e => setNonExpiring(e.target.checked)} />
                            </fieldset>

                            <TextInput
                                name="ExpirationDate"
                                labelText="Expiration Date"
                                InputLabelProps={{ shrink: true, required: true }}
                                type="date"
                                size='small'
                                id="ExpirationDate"
                                disabled={nonExpiring}
                                variant='standard'
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                          />

                            {/* <DatePicker  dateFormat="d-m-Y" datePickerType="single" light={false}>
                            <DatePickerInput
                                id="expirationDate"
                                placeholder="mm-dd-yyyy"
                                labelText="Date picker label"
                                type="text"
                                value={expirationDate}
                                disabled={nonExpiring}
                                onChange={(e) => setExpirationDate(e.target.value)}

                                />
                            </DatePicker> */}

                            <TextArea
                                //cols={100}
                                //  helperText="Exception Description"
                                id="exceptionDescription"
                                invalidText="Invalid error message."
                                labelText="Exception Description"
                                placeholder="Type Exception Description"
                                rows={4}
                                value={exceptionDescription}
                                onChange={(e) => setExceptionDescription(e.target.value)}

                            />


                            {/* <FormControl sx={{ m: 1 }} size="mediam">
                                <TextField
                                    name="Expiration Date"
                                    label="Expiration Date"
                                    InputLabelProps={{ shrink: true, required: true }}
                                    type="date"
                                    size='small'
                                    disabled={nonExpiring}
                                    variant='standard'
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                />

                            </FormControl> */}



                            {/* <TextField
                            style={{ marginTop: "8px" }}
                            variant='standard'
                            id="outlined-name"
                            title='Exception Description'
                            label="Exception Description"
                            value={exceptionDescription}
                            required
                            rows={2}
                            multiline
                            onChange={(e) => setExceptionDescription(e.target.value)}
                        /> */}


                        </React.Fragment>

                        : ""}

                    {type === "calibration" ?
                        <span>
                            Policy Parameters:  <br />
                            {policyParamsKeyValue?.map((element, j) => {
                                return (
                                    <span style={{ marginBottom: '-5px' }} >
                                        <TextInput
                                            labelText={element?.name}
                                            id={'policyParam' + j}
                                            style={{ marginTop: '-5px' }}
                                            name={element?.name}
                                            value={element?.value}
                                            onChange={handlePolicyParams}

                                        />
                                    </span>
                                );
                            })}
                        </span>

                        : ""}

                    {type === "calibration" || type === "valid deviation" || type === 'false positive' ? <span>  Violations:
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
                                                {i + 1}. {element?.hostname}
                                            </TableCell>
                                            <TableCell>
                                                {element?.violation?.message}
                                            </TableCell>
                                        </TableRow>

                                    );
                                })}
                            </TableBody>
                        </Table> </span> : ""}



                    {type === "valid deviation" || type === "calibration" ? <React.Fragment>
                        {/* <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancel
                        </Button> */}

                        <Button
                            // disabled={actionType === 'Edit' && type === 'calibration' ? true : false}
                            variant="outlined" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </React.Fragment> : ""}


                </Stack>
            </Form>
        </div>
    );
}
