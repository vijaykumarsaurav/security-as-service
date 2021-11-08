import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import UserService from "../service/UserService";
import {resolveResponse} from "../../utils/ResponseHandler";
import PostLoginNavBar from "../PostLoginNavbar";
import Notify from "../../utils/Notify";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from "@material-ui/core/Input";
import MaterialUIPickers from "./MaterialUIPickers";
import "./kyc.css";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneSharpIcon from '@material-ui/icons/DoneSharp';
import md5  from 'md5'; 
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CryptoJS  from 'crypto-js'; 
import Divider from '@material-ui/core/Divider';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Spinner from "react-spinner-material";

class DataEntryEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
                txnId: '',
                mobileNumber: localStorage.getItem('mobileNumber'), 
                poiNumber: localStorage.getItem('poiNumber'), 
                poiType:'',
                nationality: "", 
                visaSectionVisible :false, 
                NicOnlyFlag: false,
                title:'',
                gender:'',
                dob:'',
                rejectedReasons:'',
              
                approveDone:false,
                approveButton:true,
                loginId:'',
                firstName:"",
                middleName:"",
                lastName:"",
                alternateNumber:'', 
                propMobile:'',
                emailid:'',
                address1:'',
                address2:'',
                address3:'',
                customerImageUrl:"",
      
                pefImageUrl:'',
                comment:"",
                loading: true,
                isValidEmail:true,
        
                submitDataFlag:false,
                submitLoader:false,
                imageURL: "",
                presentAddress1:"",
                isPresentAddDiffrent: false


                
        }
        this.onChange = this.onChange.bind(this);
        this.myCallback = this.myCallback.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeAlternateNo = this.onChangeAlternateNo.bind(this);
        this.slideRef = React.createRef(); 

    }
    myCallback = (date, fromDate) => {
        if (fromDate === "START_DATE") {
            var formattedDate = date && date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'numeric', year: 'numeric'
            }).replace(/ /g, '');
          
            var exdate =  formattedDate.split('/'); 
            var formatDate = exdate[0] + '' + exdate[1] + ''+ exdate[2]

           // var dateStr =  date.getDate() + "/" + date.getMonth() + '/' +  date.getFullYear();
            this.setState({ visaExpiry: formatDate });
        } 
    };

   

    componentDidMount() {
      
    
    }

 
    validateUploadFile = (file) => {
        const filename = file && file.name.toString(); 
    
        if (/[^a-zA-Z0-9\.\-\_ ]/.test(filename)) {
            Notify.showError("File name can contain only alphanumeric characters including space and dots")
            return false;
        }
    
        if(file && file.type == "image/png" || file.type == "image/jpeg"){
            var fileSize = file.size / 1000; //in kb
            if(fileSize >= 10 && fileSize <= 3072){
              const fileext =  filename.split('.').pop(); 
              Object.defineProperty(file, 'name', {
                writable: true,
                value:  md5(file.name) +"."+ fileext
              });
              return file;
            }else{
              Notify.showError("File size should be grater than 100KB and less than 3MB")
            }
        }else {
          Notify.showError("Only png and jpeg file allowd.")
        }
        return false;
      }

      onChangeFileUpload = e => {

        this.setState({ [e.target.name]: e.target.files[0]});

        const filetoupload = this.validateUploadFile(e.target.files[0]); 
         if (filetoupload){
           this.setState({
               [e.target.name]: e.target.files[0], 
            //   [e.target.name+'Size']: e.target.files[0].size / 1000 + "KB",
               [e.target.name + 'Url']: URL.createObjectURL(e.target.files[0])
           })
         }else{
        //    this.setState({
        //        [e.target.name]: null, 
        //        [e.target.name+'Size'] : "",
        //        [e.target.name]: ""
        //    })
           e.target.value = null;
     
         }
       } 

   
    handleChange = name => event => {
        this.setState({ ...this.state, [name]: event.target.checked });
    };

   
    submitDataEntry = (e) => {
        e.preventDefault();
        console.log(this.state.emailid);


        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        
        if(this.state.emailid){
            if(!pattern.test(this.state.emailid)){
                Notify.showError("Email id is not valid");
                return;
            }
        }

        if(!this.state.poiType){
            Notify.showError("POI Type required");
            return;
        }
      


        if(!this.state.nationality){
            Notify.showError("Nationality required");
            return;
        }


        if(!this.state.POIFront){
            Notify.showError("POI Front Image required");
            return;
        }


        if(!this.state.billingProof){
            Notify.showError("Billing Proof required");
            return;
        }
        if(!this.state.title){
            Notify.showError("Select your name title");
            return;
        }
        if(!this.state.gender){
            Notify.showError("Select your gender");
            return;
        }

        if(!this.state.emailid){
            Notify.showError("Email id Required");
            return;
        }

        if(!this.state.firstName){
            Notify.showError("First name required");
            return;
        }

        if(!this.state.customerSignature){
            Notify.showError("Customer Signature required");
            return;
        }


       if(!window.confirm("Do you want to submit?")){
        return;
       }

          this.setState({ submitLoader: true});
          const formData = new FormData();
          formData.append('mobileNumber', this.state.mobileNumber);
          formData.append('poiNumber', this.state.poiNumber);
          formData.append('poiType', this.state.poiType);
          formData.append('title', this.state.title);
          formData.append('gender', this.state.gender);
          formData.append('deviceId', this.state.mobileNumber + Math.floor(new Date().getTime()/1000));
          formData.append('latLong', '');
          formData.append('presentAddress', this.state.presentAddress1);
          formData.append('alternateNumber', this.state.alternateNumber);
          formData.append('email', this.state.emailid);

          formData.append('visaExpiry', this.state.visaExpiry);
          formData.append('visaNumber', this.state.visaNumber);
          formData.append('nationality', this.state.nationality);
          formData.append('firstName', this.state.firstName);  
          formData.append('middleName', this.state.middleName);  
          formData.append('lastName', this.state.lastName);  

          formData.append('address1', this.state.address1);  
          formData.append('address2', this.state.address2);  
          formData.append('address3', this.state.address3);  

            if(this.state.POIFront){
                formData.append('poiFrontImage', this.state.POIFront);
            }
            if(this.state.POIBack){
                formData.append('poiBackImage', this.state.POIBack);
            }
            if(this.state.visaImage){
                formData.append('visaImage', this.state.visaImage);
            }
            if(this.state.billingProof){
                formData.append('billingProofImage', this.state.billingProof);
            }
            if(this.state.customerPhoto){
                formData.append('customerPhotoImage', this.state.customerPhoto);
            }
            if(this.state.customerSignature){
                formData.append('userSignature', this.state.customerSignature);
            }

        UserService.submitData(formData)
        .then(res => {
            
        var data =   resolveResponse(res, "");
            if(data.status == 200){
                this.setState({ submitDataFlag : true});
                this.setState({ submitLoader: false});
                localStorage.setItem('selectedMSISDN', this.state.mobileNumber); 
            }
        });
    };


    cancel = (e) => {
        if(localStorage.getItem('fromSubmit') == 'yes'){
          //  this.props.history.push('/resubmit-dataentry');
        }else{
           // this.props.history.push('/dataentry');
        }
    };

    onChangeAlternateNo = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value) && e.target.value.length <= 10) {
            this.setState({[e.target.name]: e.target.value})
        }else{
            this.setState({[e.target.name]: e.target.value.replace(/[^0-9]/g, '').substring(0, 10)})  
        }  
    }

    onChange = (e) => {
        var data =  e.target.value.trim();
        console.log("e.target.name.length", data.length);
        var test = !data.includes("$") && !data.includes("&"); 
        if(test){
            if(e.target.name == "firstName" && /^[a-zA-Z ]+$/.test(e.target.value) && e.target.value.length <= 64){
                this.setState({[e.target.name]: e.target.value});
            }else if(e.target.name == "middleName" || e.target.name == "lastName" ){
                if(/^[a-zA-Z ]+$/.test(e.target.value)){
                    this.setState({[e.target.name]: e.target.value});
                }
            }else if(e.target.name != "firstName"){
                this.setState({[e.target.name]: e.target.value});
            }
        }
        
        if(e.target.name ==  "nationality" || e.target.name ==  "poiType" ){
            if((this.state.poiType == 'PASSPORT' && e.target.name ==  "nationality" &&  e.target.value == "FOREIGNER") || (this.state.nationality == 'FOREIGNER' && e.target.name ==  "poiType" &&  e.target.value == "PASSPORT") ){
                this.setState({visaSectionVisible: true});   
            }  else {
                this.setState({visaSectionVisible: false, visaNumber: ""});   
            }
        }

        if(e.target.name ==  "poiType" &&  e.target.value == "NIC" ){
            this.setState({NicOnlyFlag: true});   
        }  else {
            this.setState({NicOnlyFlag: false});   
        }
        
        if(e.target.name == "title" &&  e.target.value == "Ms" || e.target.value == 'Mrs'){
            this.setState({gender: "F"});   
        }
        if(e.target.name == "title" &&  e.target.value == "Mr"){
            this.setState({gender: "M"});   
        }
        if(e.target.name == "PresentAddCheckbox" && e.target.checked){
            this.setState({isPresentAddDiffrent: true});   
        }else  if(e.target.name == "PresentAddCheckbox" && !e.target.checked){
            this.setState({isPresentAddDiffrent: false, presentAddress1 : ""});   
        }

        if(e.target.value.length == 0){
            this.setState({[e.target.name]: ''});
        }

        

    }

    onChangeEmail = (e) => {
        this.setState({[e.target.name]: e.target.value.trim()});
    }

    render() {

        const dateParam = {
            myCallback: this.myCallback,
            visaExpiry: this.state.visaExpiry,
            endDate: ''
        }
    

        return(
            <React.Fragment>
                   <PostLoginNavBar/>
             <Grid  direction="row" container className="flexGrow" spacing={1} style={{padding:"10px",     justifyContent: 'center'}}>
              
              
              <Grid item  xs={12} sm={8}>

                    <Paper style={{padding:"20px" }}>
                    <Typography  variant="h6" style={{textAlign:"center"}} color="primary">KYC Re-Registration </Typography>

                    
                    <form id="dataentryform" style={styles.formContainer}>
                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <TextField label="Mobile Number" fullWidth  name="mobileNumber" value={this.state.mobileNumber} onChange={this.onChangeAlternateNo} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField  label="NIC Number" value={this.state.poiNumber} fullWidth name="poiNumber"  onChange={this.onChangeAlternateNo}/>
                            </Grid>
                        </Grid>

                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                 <FormControl style={styles.selectStyle}>
                                    <InputLabel required={true}  htmlFor="gender">POI Type</InputLabel>
                                    <Select value={this.state.poiType}  name="poiType" onChange={this.onChange}>
                                        <MenuItem value={"NIC"}>NIC</MenuItem>
                                        <MenuItem value={"DL"}>DL</MenuItem>
                                        <MenuItem value={"PASSPORT"}>PASSPORT</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                            <FormControl style={styles.selectStyle}>
                                    <InputLabel  required={true} htmlFor="gender">Nationality</InputLabel>
                                    <Select value={this.state.nationality}  name="nationality" onChange={this.onChange}>
                                        <MenuItem value={"SRILANKAN"}> Sri Lankan</MenuItem>
                                        {this.state.poiType == "PASSPORT" ? <MenuItem value={"FOREIGNER"}>Foreigner</MenuItem> : []}

                                    </Select>
                                </FormControl>

                            </Grid>
                        </Grid>


                       { this.state.visaSectionVisible ? <> 
                       
                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                               <TextField label="Visa Number" value={this.state.visaNumber} fullWidth name="visaNumber"  onChange={this.onChange}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MaterialUIPickers callbackFromParent={dateParam} />
                            </Grid>
                          
                        </Grid>

                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor="gender" required={true}>Upload Visa Image</InputLabel>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl style={styles.multiselect}>
                                    <input
                                    style={{
                                        marginTop: "31px",
                                        marginLeft: "18px"
                                    }}
                                    type="file"
                                    name="visaImage"
                                    onChange={this.onChangeFileUpload}
                                    />
                                </FormControl>
                                
                            </Grid>
                            <Grid  container spacing={24} container
                                direction="row"
                                justify="center">
                                
                                <Grid item xs={12} sm={6}>
                                        Selected File Size: {this.state.visaImageSize}
                                        <br />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                    <img title="Preview Visa Image"  style={{width:"200px", height:"100px" , backgroundColor: 'lightgray'}} src={this.state.visaImageUrl} />
                                </Grid>
                            </Grid>
                        </Grid>
                        </> : ""}

                       
                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor="gender" required={true}>POI Front Image</InputLabel>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl style={styles.multiselect}>
                                    <input
                                    style={{
                                        marginTop: "31px",
                                        marginLeft: "18px"
                                    }}
                                    type="file"
                                    name="POIFront"
                                    onChange={this.onChangeFileUpload}
                                    />
                                </FormControl>
                                
                            </Grid>
                            <Grid  container spacing={24} container
                                direction="row"
                                justify="center">
                                
                                <Grid item xs={12} sm={6}>
                                        Selected File Size: {this.state.POIFrontSize}
                                        <br />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                    <img title="Preview POI Front"  style={{width:"200px", height:"100px", backgroundColor: 'lightgray'}} src={this.state.POIFrontUrl} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor="gender" required={ this.state.NicOnlyFlag }>POI Back Image</InputLabel>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl style={styles.multiselect}>
                                    <input
                                    style={{
                                        marginTop: "31px",
                                        marginLeft: "18px"
                                    }}
                                    type="file"
                                    name="POIBack"
                                    onChange={this.onChangeFileUpload}
                                    />
                                </FormControl>
                                
                            </Grid>
                            <Grid  container spacing={24} container
                                direction="row"
                                justify="center">
                                
                                <Grid item xs={12} sm={6}>
                                        Selected File Size: {this.state.POIBackSize}
                                        <br />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                    <img title="Preview POI Back"  style={{width:"200px", height:"100px",backgroundColor: 'lightgray'}} src={this.state.POIBackUrl} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor="gender" required={true}>Billing Proof image</InputLabel>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl required={true} style={styles.multiselect}>
                                    <input
                                    style={{
                                        marginTop: "31px",
                                        marginLeft: "18px"
                                    }}
                                    type="file"
                                    name="billingProof"
                                    onChange={this.onChangeFileUpload}
                                    />
                                </FormControl>
                                
                            </Grid>
                            <Grid  container spacing={24} container
                                direction="row"
                                justify="center">
                                
                                <Grid item xs={12} sm={6}>
                                        Selected File Size: {this.state.billingProofSize}
                                        <br />
                                    </Grid>

                                    <Grid item xs={12} sm={6} style={{ margin: 'auto'}}>
                                    
                                    {/* 
                                     <div style={{width:"200px", height:"100px", backgroundColor: 'lightgray'}}>
                                     <div>Preview Billing Proof </div>
                                     </div> */}
                                     
                                     {/* <div class="previewContainer">
                                     <div class="preview-vertical-center">
                                            <InputLabel>Preview Billing Proof</InputLabel>
                                    </div>
                                    </div> */}
                                     <img title="Preview Billing Proof"  style={{width:"200px", height:"100px", backgroundColor: 'lightgray' }} src={this.state.billingProofUrl} />

                                </Grid>
                            </Grid>
                        </Grid>

                      
                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>

                                <FormControl style={styles.selectStyle}>
                                    <InputLabel  required={true} htmlFor="title">Title</InputLabel>
                                    <Select  value={this.state.title}  name="title" onChange={this.onChange}>
                                        <MenuItem value={"Mr"}>Mr</MenuItem>
                                        <MenuItem value={"Ms"}>Ms</MenuItem>
                                        <MenuItem value={"Mrs"}>Mrs</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl style={styles.selectStyle}>
                                    <InputLabel  required={true} htmlFor="gender">Gender</InputLabel>
                                    <Select value={this.state.gender}  name="gender" onChange={this.onChange}>
                                        <MenuItem value={"M"}>Male</MenuItem>
                                        <MenuItem value={"F"}>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>


                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                            <TextField label="First Name" value={this.state.firstName} required={true} fullWidth name="firstName"  onChange={this.onChange}/>

                           
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Middle Name"  value={this.state.middleName} fullWidth name="middleName" onChange={this.onChange}/>
                            </Grid>
                         
                          
                        </Grid>
                       

                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6} >
                                <TextField label="Last Name" value={this.state.lastName}  fullWidth name="lastName"  onChange={this.onChange}/>
                            </Grid> 
                           
                            <Grid item xs={12} sm={6}>
                                <TextField label="Alternate Contact No" fullWidth  name="alternateNumber" value={this.state.alternateNumber} onChange={this.onChangeAlternateNo}/>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                    <TextField required={true} label="Email id" fullWidth  name="emailid" value={this.state.emailid} onChange={this.onChangeEmail}/>
                            </Grid>
                         
                        </Grid>

                        <Grid spacing={1} container direction="row">
                           
                            <Grid item xs={12} sm={12}>
                     
                            <br />
                            <InputLabel> Permanent Address</InputLabel>
                            <Divider />
                            </Grid>
                           
                            <Grid item xs={12} sm={4}>
                                <TextField label="House No." value={this.state.address1} fullWidth name="address1" onChange={this.onChange} />

                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Lane or Road" value={this.state.address2} fullWidth name="address2" onChange={this.onChange} />
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <TextField label="Town" value={this.state.address3} fullWidth name="address3" onChange={this.onChange} />
                            </Grid>

                           

                          

                           

                        </Grid>



                            <Grid item xs={12} sm={4}>
                              <FormControlLabel
                                value="All"
                                control={<Checkbox onChange={this.onChange} name="PresentAddCheckbox" color="primary"  />}
                                label="Present address is different from permanent address"
                                labelPlacement="right"
                                />
                            </Grid>


                            {this.state.isPresentAddDiffrent ?  
                             <Grid item xs={12} sm={12}>
                                <TextField label="Present Address" value={this.state.presentAddress1} fullWidth name="presentAddress1" onChange={this.onChange} />
                            </Grid> : ""}
                        

                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <br/>
                                <InputLabel htmlFor="gender">Customer Photo</InputLabel>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl style={styles.multiselect}>
                                    <input
                                    style={{
                                        marginTop: "31px",
                                        marginLeft: "18px"
                                    }}
                                    type="file"
                                    name="customerPhoto"
                                    onChange={this.onChangeFileUpload}
                                    />
                                </FormControl>
                                
                            </Grid>
                            <Grid  container spacing={24} container
                                direction="row"
                                justify="center">
                                
                                <Grid item xs={12} sm={6}>
                                        Selected File Size: {this.state.customerPhotoSize}
                                        <br />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                    <img title="Preview Customer Photo"  style={{width:"200px", height:"100px" , backgroundColor: 'lightgray'}} src={this.state.customerPhotoUrl} />
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={6}>
                                <br/>
                                <InputLabel required={true} htmlFor="gender">Customer Signature photo</InputLabel>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl style={styles.multiselect}>
                                    <input
                                    style={{
                                        marginTop: "31px",
                                        marginLeft: "18px"
                                    }}
                                    type="file"
                                    name="customerSignature"
                                    onChange={this.onChangeFileUpload}
                                    />
                                </FormControl>
                                
                            </Grid>
                            <Grid  container spacing={24} container
                                direction="row"
                                justify="center">
                                
                                <Grid item xs={12} sm={6}>
                                        Selected File Size: {this.state.customerSignatureSize}
                                        <br />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                    <img title="Preview Customer Signature Photo"  style={{width:"200px", height:"100px", backgroundColor: 'lightgray'}} src={this.state.customerSignatureUrl} />
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid spacing={1} container direction="row">
                            <Grid item xs={12} sm={12}>
                            <InputLabel>Declaration</InputLabel>
                            <div style={{ fontSize: '12px'}}>

                            I/ We represent that I/ we have been fully informed about the service provided by Airtel. I/ We agree and hereby provide the consent to verify the authenticity of the particulars related to the National Identity Card via the information system of the Department for Registration of Persons. I/ We further agree and provide the consent for Airtel to share my personal details not limited to NIC details with the parties mentioned under the terms and conditions in order to provide any additional services to me/ us if required.  I/We declare that I/we have access to the internet and that I/we have read and understood the terms and conditions hosted on www.airtel.lk and unconditionally accept them as binding on me/ us. Furthermore, I/ we certify and confirm that the information provided by me/ us is true and correct.

                            </div>
                            
                            </Grid>

                          
                        </Grid>

                        <Grid spacing={1} container direction="row"  justify="space-between" >

                           <Grid item xs={12} sm={12}   style={{textAlign:"center"}}>
                              <br /> 


                           
                                {this.state.submitDataFlag ? <Typography  variant="h6" style={{textAlign:"center"}} color="primary">Your data submitted successfully</Typography>
                                 :  this.state.submitLoader ? <Spinner/> :   <Button variant="contained"  onClick={this.submitDataEntry} color={'primary'} style={{marginLeft: '20px'}}> Submit Your KYC </Button> }      
                          
                            
                            

                            </Grid>
                        </Grid>
                     
                    </form>
                    </Paper>
                </Grid>
        

            
              
            </Grid>


            </React.Fragment>
        )
    }

    
   
}

const styles ={
    formContainer : {
        display: 'flex',
        flexFlow: 'row wrap'
    },

    textStyle :{
        display: 'flex',
        justifyContent: 'center'

    },
    imgStyle:{
        display:'flex'
    }, 

    selectStyle:{
        minWidth: '100%',
        marginBottom: '10px'
    },
    MuiTextField:{
        overflowY: 'scroll',
        fontSize:"12px", 
        maxHeight:"50px",
        
    },
    footerButton: {
        position: 'fixed',
        left: 0,
        bottom: '20px',
        width: '100%',
        textAlign: 'right'
    }

};

export default DataEntryEdit;