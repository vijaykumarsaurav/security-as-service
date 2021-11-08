import React from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UserService from "../service/UserService";
import LoginNavBar from "../LoginNavbar";
import {Container} from "@material-ui/core";
import { resolveResponse } from '../../utils/ResponseHandler';
import Notify from "../../utils/Notify";
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Dialogbox  from './Dialogbox';
import DialogboxRejected  from './DialogboxRejected';
import CryptoJS  from 'crypto-js'; 


import CheckStatusUi from './CheckStatusUi';


class LoginComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isDasable:false,
            isError:false,
            otpFlag:false,
            actionText  : "Send OTP", 
            simRefNumber : "", 
            otpToken : "test",
            otpCode : "", 
            message : "",
            otpCodeRequired : true,
            alternateNum : ""
  
        };

    }


    render() {

        return(
            <React.Fragment>
                <LoginNavBar/>
                <Dialogbox propdata = {{showPopupTitle: this.state.showPopupTitle, showPopupMessage: this.state.showPopupMessage}} />
                <DialogboxRejected propdata = {{showPopupTitle: this.state.showPopupTitle, showPopupMessage: this.state.showPopupMessage}} />

                {/* New Login UI */}
                <CheckStatusUi loginProps={ {onChange : this.onChange, onChangeMobileNo: this.onChangeMobileNo, onChangeOtp : this.onChangeOtp, onChangeNic : this.onChangeNic,  alternateNum: this.state.alternateNum, otpCode:  this.state.otpCode, simRefNumber : this.state.simRefNumber, otpFlag: this.state.otpFlag , actionText: this.state.actionText, sendOtp:this.sendOtp, isDasable: this.state.isDasable, isError: this.state.isError,  } }/>
             
                
                <Grid container justify="space-around" >
                    
                  
                     <Grid justify={"center"} container  xs={12} sm={12}>
                        <Typography variant="h6" style={styles.label}> {this.state.resultedAlternateNum ? "Alternate Number: " + this.state.resultedAlternateNum : ""}</Typography>
                     </Grid>
                     <Grid justify={"center"} container  xs={12} sm={12}>
                        <Typography variant="h6" style={styles.label}> {this.state.resultedsimRefNumber ? "SIM Reference Number: " + this.state.resultedsimRefNumber : ""}</Typography>
                     </Grid>

                     <Grid justify={"center"} container  xs={12} sm={12}>
                        <Typography variant="h6" style={styles.label}> {this.state.status ? "Status:  " + this.state.status : ""}</Typography>
                     </Grid>


                    <Grid justify={"center"} container  xs={12} sm={12}>
                      <Typography variant="h6" style={styles.label}>{this.state.rejectReasons ?  "Reject Reason: " +this.state.rejectReasons : ""}</Typography>
                     </Grid>
                     <Grid justify={"center"} container  xs={12} sm={12}>

                      <Typography variant="h6" style={styles.label}>{this.state.correctionReasons ? "How to correct: " + this.state.correctionReasons : ""} </Typography>

                     </Grid>
                     <Grid justify={"center"} container  xs={12} sm={12}>
                        <br /> <br />
                        {this.state.correctionReasons ? <Button
                            type="button"
                            
                            variant="contained"
                            color="primary"
                            //style={{backgroundColor:'red', color:'white'}}
                            onClick={this.gotoLoginPage}
                        >

                        Click to resubmit your details
                        
                        </Button> 
                        :
                         ""}
                     </Grid>
                    
                </Grid>
            </React.Fragment>
        )

    }

    gotoLoginPage=()=>{
        this.props.history.push('/login');
    }

    componentDidMount() {

      const requestToken =   window.localStorage.getItem("requestToken"); 
      if(requestToken){
        this.props.history.push('/user-re-registration');
      }

    }   

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    }

    onChangeMobileNo = (e) => {

        console.log(e.target.name, e.target.value )
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value) && e.target.value.length <= 10) {
            this.setState({[e.target.name]: e.target.value})
        }else{
            this.setState({[e.target.name]: e.target.value.replace(/[^0-9]/g, '').substring(0, 10)})  
        }  
    }
    onChangeOtp = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value) && e.target.value.length <= 6) {
            this.setState({[e.target.name]: e.target.value})
        }else{
            this.setState({[e.target.name]: e.target.value.replace(/[^0-9]/g, '').substring(0, 6)})  
        }  
    }
    onChangeNic = (e) => {
        const re = /^[0-9A-Za-z\b]+$/;
        if (e.target.value === '' || re.test(e.target.value) && e.target.value.length <= 12) {
            this.setState({[e.target.name]: e.target.value})
        }else{
            this.setState({[e.target.name]: e.target.value.replace(/[^0-90-9A-Za-z]/g, '').substring(0, 12)})  
        }  
    }


    sendOtp = (e) => {
        
         e.preventDefault();

         this.setState({resultedAlternateNum: '', resultedsimRefNumber : '', status: '', rejectReasons:"",correctionReasons:"" });

         if(!this.state.simRefNumber){
            this.setState({ isError: "SIM Reference Number is required." });
            return;
        }

        if(!this.state.alternateNum){
            this.setState({ isError: "Enter your Alternate Number." });
            return;
        }
       


        this.setState({ isError: "" });

        this.setState({ isDasable: true });

        var keynum = Math.floor(Math.random() * 1E16);
        if (keynum.toString().length == 15) {
            keynum = keynum.toString() + "9";
        }
        var atualkey = (keynum * 69 - 99).toString();
        atualkey = atualkey.substring(0, 15);
        var simRefNumberEncrypted = CryptoJS.AES.encrypt(this.state.alternateNum, atualkey).toString() + keynum;
        
    
        const loginPayload = {
          //  simRefNumber:  simRefNumberEncrypted,
            alternateNum: this.state.alternateNum,
            simRefNumber:  this.state.simRefNumber
        };
        UserService.checkDiyStatus(loginPayload)
            .then(res => {
              //  Notify.showError("Olms Id and otpToken is required.");
            //  alert(JSON.stringify(res));

                var data = res.data; 


                if(data.message !== 'ok'){
                    this.setState({ isError: res.data.message });
                }
               // var data = resolveResponse(res);
              
               // data = res.data; 
                this.setState({ isDasable: false });
            
                if(data.result){
                    this.setState({resultedAlternateNum:  this.state.alternateNum, resultedsimRefNumber : this.state.simRefNumber});
                    this.setState({status: data.result.status});
                    localStorage.setItem("simRefNumber",this.state.simRefNumber )
                    localStorage.setItem("alternateNum",this.state.alternateNum )


                    if(data.result &&  data.result.rejected){
                        localStorage.setItem("reSubmit", true ); 

                        this.setState({ isError: "" });
                        this.setState({ rejectReasons : data.result.rejectReasons, correctionReasons : data.result.correctionReasons });
                    }
                    
                }
            });

            //to show only
            // Notify.showSuccess("OTP has sent to your number");
            // this.setState({ otpFlag : true, actionText : "Login", otpToken :  '' });

    }


  

}

const styles ={
    formStyle :{
        display: 'flex',
        flexFlow: 'row wrap'
    },
    label: {
        display: 'flex',
        justifyContent: 'center'
    },
    errorMessage:{
        color:"red",
        marginTop: '11px'
    },
    waitMessage:{
        color:"gray",
        marginTop: '11px'

    }

}

export default LoginComponent;