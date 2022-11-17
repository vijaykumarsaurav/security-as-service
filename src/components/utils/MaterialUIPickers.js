import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
//import DateFnsUtils from '@date-io/date-fns';
import Notify from "../utils/Notify";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {

  var startd = new Date(); 
  startd.setHours(9,0,0,0);
  startd.setMinutes(15,0,0,0);

  // The first commit of Material-UI
  var [selectedStartDate, setSelectedStartDate] = React.useState(startd);
  var endd = new Date(); 
  endd.setHours(15,0,0,0);
  endd.setMinutes(30,0,0,0);

  var [selectedEndDate, setSelectedEndDate] = React.useState(endd);

  const handleStartDateChange = date => {
    setSelectedStartDate(date);
    props.callbackFromParent.myCallback(date,"START_DATE");
    // var startDateMili = new Date(date).getTime(); 
    // document.getElementById("startDateMili").value = startDateMili; 
    // var endDateMili = document.getElementById("endDateMili").value; 
    // if(startDateMili > endDateMili  ){
    //   Notify.showError("Start date time can't be grater than end date.");
    // }
  };



  const handleEndDateChange = date => {
    setSelectedEndDate(date);
    props.callbackFromParent.myCallback(date,"END_DATE");
  //   var endDateMili = new Date(date).getTime(); 
  //   document.getElementById("endDateMili").value = endDateMili; 

  //  var startDateMili = document.getElementById("startDateMili").value; 
  //  if(endDateMili  < startDateMili){
  //     Notify.showError("End Date time can't be less than start date.");
  //   }
   
  };

  var selectedDate =  document.getElementById("startDateMili") && document.getElementById("startDateMili").value; 
  if(props.callbackFromParent && props.callbackFromParent.startDate){
    selectedStartDate = new Date(props.callbackFromParent.startDate).getTime(); 
   // document.getElementById("startDateMili").value = props.callbackFromParent.startDate;
  }

  var endDateMili =  document.getElementById("endDateMili") && document.getElementById("endDateMili").value; 
  //endDateMili ==''
  if(props.callbackFromParent && props.callbackFromParent.endDate){
    selectedEndDate = new Date(props.callbackFromParent.endDate).getTime();  
    //document.getElementById("endDateMili").value = props.callbackFromParent.endDate;

  }


 console.log("propes", props)
 return (
    <MuiPickersUtilsProvider >
      <Grid container justify="space-around">
     
        <KeyboardDatePicker
       //   disablePast="true"
          margin="normal"
          required={true}
          id="date-picker-dialog"
          label={props.callbackFromParent.firstLavel}
          format="dd-MM-yyyy"
          value={selectedStartDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Start Time"
          value={selectedStartDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
        
        <KeyboardDatePicker
        //  disablePast="true"
          margin="normal"
          required={true}
          id="date-picker-dialog"
          label={props.callbackFromParent.secondLavel}
          format="dd-MM-yyyy"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
       
       <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="End Time"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
        
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
