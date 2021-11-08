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


import LoginNewUI from './LoginNewUI';


class LoginComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            alternateNum: "",
            isDasable:false,
            isError:false,
            otpFlag:false,
            actionText  : "Send OTP", 
            simRefNumber : localStorage.getItem('simRefNumber') ? localStorage.getItem('simRefNumber') :  "", 
            alternateNum : localStorage.getItem('alternateNum') ? localStorage.getItem('alternateNum') :  "", 
            otpToken : "test",
            otpCode : "", 
            message : "",
            otpCodeRequired : true, 
            disableSimRef : localStorage.getItem('simRefNumber') ? true : false
         
        };
        this.login = this.login.bind(this);

    }


    render() {

        return(
            <React.Fragment>
                <LoginNavBar/>
                <Dialogbox propdata = {{showPopupTitle: this.state.showPopupTitle, showPopupMessage: this.state.showPopupMessage}} />
                <DialogboxRejected propdata = {{showPopupTitle: this.state.showPopupTitle, showPopupMessage: this.state.showPopupMessage}} />


                
                {/* <Container maxWidth="sm">
                     <br/><br/><br/> 
                    <Typography variant="h4" style={styles.label}>Login</Typography>
                    <form style={styles.formStyle}>
                        <TextField type="text"  required={true} label="Olms Id" fullWidth margin="normal" name="alternateNum" value={this.state.alternateNum}  onChange={this.onChange}/>

                        <TextField type="otpToken"  required={true} label="otpToken" fullWidth margin="normal" name="otpToken" value={this.state.otpToken} onChange={this.onChange}/>
                        <Grid item  xs={12} sm={8}>
                            <Button disabled={this.state.isDasable}  variant="contained" color="primary" onClick={this.login}>Login</Button>
                        </Grid>
                        <Grid item  xs={12} sm={10}>
                             {this.state.isDasable ? <InputLabel variant="subtitle1" style={styles.waitMessage}> Please wait...</InputLabel> :""} 
                             {this.state.isError ? <InputLabel variant="subtitle1" style={styles.errorMessage}> {this.state.isError} </InputLabel>: ""}  
                        </Grid>
                    </form>
                </Container> */}

                {/* New Login UI */}
                <LoginNewUI loginProps={ {onChange : this.onChange, onChangeMobileNo: this.onChangeMobileNo, onChangeOtp : this.onChangeOtp, onChangeNic : this.onChangeNic, login: this.login,   alternateNum: this.state.alternateNum, otpCode:  this.state.otpCode, simRefNumber : this.state.simRefNumber, otpFlag: this.state.otpFlag , actionText: this.state.actionText, sendOtp:this.sendOtp, isDasable: this.state.isDasable, isError: this.state.isError, disableSimRef:this.state.disableSimRef} }/>
                {/* <Grid container justify="space-around">
                    <Grid justify={"center"} container  xs={12} sm={10}>
                            {this.state.isDasable ? <InputLabel variant="subtitle1" style={styles.waitMessage}> Please wait...</InputLabel> :""} 
                            {this.state.isError ? <InputLabel variant="subtitle1" style={styles.errorMessage}> {this.state.isError} </InputLabel>: ""}  
                    </Grid>
                </Grid> */}
            </React.Fragment>
        )

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

        if(!this.state.alternateNum){
            this.setState({ isError: "Mobile number required." });
            return;
        }
        if(!this.state.simRefNumber){
            this.setState({ isError: "SIM Reference Number is required." });
            return;
        }

        this.setState({ isError: "" });

        this.setState({ isDasable: true });

    
        const loginPayload = {
            phone:  this.state.alternateNum,
            simReferenceNumber:  this.state.simRefNumber
        };
        UserService.sendOtp(loginPayload)
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

                    if(data.message == 'ok' && data.status == 200 && data.result.otpToken){
                        this.setState({ isError: "" });
                        Notify.showSuccess("OTP has sent to your number");
                        this.setState({ otpFlag : true, actionText : "Login", otpToken :  data.result.otpToken });
                    }else if(data.message == 'ok' && data.status == 200){
                       
                        this.setState({ otpCodeRequired: false }, function(){
                            this.login(e); 
                        });
                    }
                    
                }
            });

            //to show only
            // Notify.showSuccess("OTP has sent to your number");
            // this.setState({ otpFlag : true, actionText : "Login", otpToken :  '' });

    }


    login = (e) => {
        
        this.setState({ isError: "" });

        console.log('login');

        e.preventDefault();

        if(!this.state.otpCode && this.state.otpCodeRequired){
            this.setState({ isError: "OTP is required." });
            return;
        }

        if(!this.state.simRefNumber){
            this.setState({ isError: "NIC Number is required." });
            return;
        }
       
        this.setState({ isDasable: true });

        var keynum = Math.floor(Math.random()*1E16);
        if(keynum.toString().length == 15){
            keynum = keynum.toString() + "9"; 
        }
        var atualkey = (keynum * 69-99).toString(); 
        atualkey =  atualkey.substring(0, 15);
        var simRefNumberEncrypted = CryptoJS.AES.encrypt( this.state.simRefNumber, atualkey).toString() + keynum; 


        const loginPayload = {
            "alternateNum": this.state.alternateNum,
            "otpToken": this.state.otpToken, 
            "simReferenceNum": this.state.simRefNumber,
            "otpCode": this.state.otpCode,
            "reSubmit" : localStorage.getItem("reSubmit") ? localStorage.getItem("reSubmit")  : false
          }

        UserService.login(loginPayload)
            .then(res => {
                var data = res && res.data; 
                                
               // var data = resolveResponse(res);
              
               // data = res.data; 
                this.setState({ isDasable: false });

                if(data &&  data.result){
                   
                    window.localStorage.setItem("staticData", JSON.stringify( data.result));
                    window.localStorage.setItem("requestToken", data.result.requestToken);
                    window.localStorage.setItem("mobileNumber", this.state.alternateNum);
                    window.localStorage.setItem("simRefNumber",this.state.simRefNumber);   

                    if(data.message == 'ok' && data.status == 200 && data.result.rejectionMessage){
                        this.setState({showPopupMessage : data.result.rejectionMessage});   
                        document.getElementById("showPopupRejected").click();    
                    }else if(data.message == 'ok' && data.status == 200){
                        this.props.history.push('/user-re-registration');
                    }
                    

                }else if(data.status == 1273 || data.status == 1274 ){
                    var msg = ''; 
                    if(data.status === 1273){
                        msg = 'We have received your documents & the status will be notified via SMS shortly. <br /><br />ඔබේ හිමිකාරිත්ව තොරතුරු අපට ලැබී ඇති අතර කෙටි වෙලාවකින් එහි තත්වය කෙටි පණිවුඩයක් මගින් දැනුම් දෙනු ලැබේ. <br /><br />உங்களுடைய தகவல்களை  நாங்கள் பெற்றுள்ளோம், அதன் நிலையை விரைவில் SMS  மூலம் உங்களுக்குத் தெரிவிப்போம்.';
                    }
                    else if(data.status === 1274){
                        msg = 'Your documents have been submitted successfully. Enjoy Airtel Services. <br /><br />ඔබේ නැවත ලියාපදිංචි ඉල්ලීම  සාර්ථකව ඇතුළත් වී ඇත. ස්තුතියි. <br /><br />உங்களுடைய பதிவு விபரங்கள் வெற்றிகரமாக சமர்பிக்கப்பட்டுள்ளன. எயார்டெல் சேவைகளை அனுபவித்திடுங்கள்';
                    }
                    this.setState({ showPopupMessage : msg });    
                    document.getElementById("showPopup").click();
                }else{
                    this.setState({ isError: res.data.message });
                }
            });  

            //to show only
           // this.props.history.push('/user-re-registration');
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