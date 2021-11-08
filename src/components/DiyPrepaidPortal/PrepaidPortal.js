import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import UserService from "../service/UserService";
import { resolveResponse } from "../../utils/ResponseHandler";
import PostLoginNavBar from "../PostLoginNavbar";
import Notify from "../../utils/Notify";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialUIPickers from "./MaterialUIPickers";
import "./kyc.css";
import md5 from 'md5';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Spinner from "react-spinner-material";
import DialogboxSubmitSucess from './DialogboxSubmitSucess'
import Parser from 'html-react-parser';
import CryptoJS from 'crypto-js';
import SearchIcon from '@material-ui/icons/Search';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import * as moment from 'moment';
import CamraLivePhoto  from './CamraLivePhoto';
import ReactPlayer from 'react-player'
import { DEV_PROTJECT_PATH } from "../../utils/config";

class DataEntryEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txnId: '',
            mobileNumber: localStorage.getItem('mobileNumber'),
            poiNumber: localStorage.getItem('poiNumber'),
            alternateNumber: localStorage.getItem('mobileNumber') ? localStorage.getItem('mobileNumber') : "",
            NicOnlyFlag: false,
            dob: '',
            submitLoader: true,
            imageURL: "",
            isPresentAddDiffrent: false,
            isSubmitButtonEnable: false,
            poiType: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.poiType ? JSON.parse(localStorage.getItem('staticData')).reSubmitData.poiType : "NIC",
            nationality: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.nationality,
            title: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.title,
            gender: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.gender,
            firstName: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.firstName,
            middleName: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.middleName,
            lastName: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.lastName,
            emailid: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.email,
            address1: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.address1,
            address2: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.address2,
            address3: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.address3,
            visaNumber: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.visaNumber,
            visaExpiry: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.visaExpiry ? JSON.parse(localStorage.getItem('staticData')).reSubmitData.visaExpiry: "",
            presentAddress1: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.presentAddress,
            visaSectionVisible: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).diyAcivationVisaImage ? JSON.parse(localStorage.getItem('staticData')).diyAcivationVisaImage : false,

            resubmitVisaShow: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.visaExpiry ? moment(JSON.parse(localStorage.getItem('staticData')).reSubmitData.visaExpiry, "MMDDYYYY").valueOf() : "",

            isBillingProofMandatry: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).kycSrilankanBillingProofImage ? true : false,
            staticData: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')),

            nicTitle: "Enter NIC Number",
            showNumberSearch: false,
            listOfNumbers: [],
            selectedMSISDN: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).msisdn,
            showDedupeFlag: true,
            disableNext10Button: false,
            countNext10Click: 0,
            cynNumberCheckFlag: true,
            showSubmitForm: false,
            takeSelfie : false


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

            var exdate = formattedDate.split('/');
            if (exdate)
                var formatDate = exdate[0] + '' + exdate[1] + '' + exdate[2]

            // var dateStr =  date.getDate() + "/" + date.getMonth() + '/' +  date.getFullYear();
            this.setState({ visaExpiry: date });

            this.setState({ visaExpiryformattedDate: formatDate });
        }
    };


    componentDidMount() {

        UserService.checkSession().then(res => {
            var data = resolveResponse(res, "");
            if (res.data && res.data.status === 1010 || res.data.status === 500) {
                localStorage.clear();
                window.location.replace('#/login');
            }
        }).catch((reject) => {
            if (reject.toString().includes("Network Error")) {
                localStorage.clear();
                this.props.history.push('/login');
            } else {
                console.log('reject', reject);
            }
        })
        
        if (this.state.staticData && this.state.staticData.simType != "SUK") {
            this.setState({ numberPattern: this.state.staticData.cynSearchPattern }, function () {
                this.cynNumberCheck();
            });
        }


        this.setState({ poiNumber: localStorage.getItem('staticData') && JSON.parse(localStorage.getItem('staticData')).reSubmitData && JSON.parse(localStorage.getItem('staticData')).reSubmitData.poiNumber })
        localStorage.setItem("activationNumber", this.state.selectedMSISDN);

        this.updateBillingProofFlag();
    }


    validateUploadFile = (file) => {
        const filename = file && file.name.toString();

        if (/[^a-zA-Z0-9\.\-\_ ]/.test(filename)) {
            Notify.showError("File name can contain only alphanumeric characters including space and dots")
            return false;
        }

        if (file && file.type == "image/png" || file.type == "image/jpeg") {
            var fileSize = file.size / 1000; //in kb
            if (fileSize >= 10 && fileSize <= 5120) {
                const fileext = filename.split('.').pop();
                Object.defineProperty(file, 'name', {
                    writable: true,
                    value: md5(file.name) + "." + fileext
                });
                return file;
            } else {
                Notify.showError("File size should be grater than 10KB and less than 5MB")
            }
        } else {
            Notify.showError("Only png and jpeg file allowd.")
        }
        return false;
    }

    onChangeFileUpload = e => {

        this.setState({ [e.target.name]: e.target.files[0] });

        // console.log("e.target.files", e.target.files)
        if (e.target.files && e.target.files.length > 0) {
            const filetoupload = this.validateUploadFile(e.target.files[0]);
            if (filetoupload) {
                this.setState({
                    [e.target.name]: e.target.files[0],
                    //   [e.target.name+'Size']: e.target.files[0].size / 1000 + "KB",
                    [e.target.name + 'Url']: URL.createObjectURL(e.target.files[0])
                })
            } else {
                this.setState({
                    [e.target.name]: null,
                    [e.target.name + 'Size']: "",
                    [e.target.name]: ""
                })
                e.target.value = null;

            }
        }

    }


    handleChange = name => event => {
        this.setState({ ...this.state, [name]: event.target.checked });
    };

    submitTheData =(formData)=>{


        UserService.submitData(formData)
        .then(res => {

            var data = resolveResponse(res, "");
            if (data.status == 200) {
                this.setState({ submitLoader: false });
                localStorage.setItem('selectedMSISDN', this.state.mobileNumber);

                document.getElementById("showPopupSuccess") && document.getElementById("showPopupSuccess").click();
            } else {
                this.setState({ submitLoader: false });
                if (data.status == 1010 || data.status === 500) {
                    localStorage.clear();
                    window.location.replace('#/');
                }

            }
        });
    }


    submitDataEntry = (e) => {
        e.preventDefault();

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (this.state.emailid) {
            if (!pattern.test(this.state.emailid)) {
                Notify.showError("Email id is not valid");
                return;
            }
        }

        if (!this.state.poiType) {
            Notify.showError("POI Type required");
            return;
        }

        if (!this.state.nationality) {
            Notify.showError("Nationality required");
            return;
        }
        if (!this.state.title) {
            Notify.showError("Select your name title");
            return;
        }
        if (!this.state.gender) {
            Notify.showError("Select your gender");
            return;
        }

        if (!this.state.firstName) {
            Notify.showError("First name required");
            return;
        }

        // if(!this.state.emailid){
        //     Notify.showError("Email id Required");
        //     return;
        // }


        if (!this.state.POIFront) {
            Notify.showError("POI Front Image required");
            return;
        }

        if (this.state.poiType == "NIC" && !this.state.POIBack) {
            Notify.showError("POI Back Image required");
            return;
        }

        if (this.state.isBillingProofMandatry && !this.state.billingProof) {
            Notify.showError("Billing Proof required");
            return;
        }

        if (this.state.nationality == 'FOREIGNER' && this.state.staticData.kycVisaImage && !this.state.visaImage) {
            Notify.showError("Visa image required");
            return;
        }

        if (!this.state.customerSignature) {
            Notify.showError("Customer Signature required");
            return;
        }

        // if(!this.state.customerPhoto){
        //     Notify.showError("Customer photo required");
        //     return;
        // }


        if (this.state.isPresentAddDiffrent && !this.state.presentAddress1) {
            Notify.showError("Present address required");
            return;
        }

        if (!this.state.isDeclarationChecked) {
            Notify.showError("Please read and select the declaration");
            return;
        }

        if (this.state.visaExpiry) {
            var visaExpiry = new Date(this.state.visaExpiry).getTime();
            var today = new Date().getTime();
            if (visaExpiry < today) {
                Notify.showError("Visa expiry can't be past date!");
                return;
            }
        }

        


        if (!window.confirm("Confirm your request | ඔබේ ඉල්ලීම තහවුරු කරන්න | உங்கள் கோரிக்கையை உறுதிப்படுத்தவும்")) {
            return;
        }


        this.setState({ submitLoader: true });

        var keynum = Math.floor(Math.random() * 1E16);
        if (keynum.toString().length == 15) {
            keynum = keynum.toString() + "9";
        }
        var atualkey = (keynum * 69 - 99).toString();
        atualkey = atualkey.substring(0, 15);
        var poiNumberEncrypted = CryptoJS.AES.encrypt(this.state.poiNumber, atualkey).toString() + keynum;
        var visaNumberEncrypted = CryptoJS.AES.encrypt(this.state.visaNumber, atualkey).toString() + keynum;

        var formData = new FormData();
        formData.append('selectedMSISDN', this.state.selectedMSISDN);
        formData.append('poiNumber', poiNumberEncrypted);
        formData.append('poiType', this.state.poiType);
        formData.append('title', this.state.title);
        formData.append('gender', this.state.gender);
        formData.append('presentAddress', this.state.presentAddress1 ? this.state.presentAddress1 : "");
        formData.append('alternateNumber', this.state.alternateNumber);
        formData.append('email', this.state.emailid ? this.state.emailid : "");

        formData.append('visaExpiry', this.state.visaExpiryformattedDate ? this.state.visaExpiryformattedDate : "");
        formData.append('visaNumber', this.state.visaSectionVisible && visaNumberEncrypted ? visaNumberEncrypted : "");
        formData.append('nationality', this.state.nationality);
        formData.append('firstName', this.state.firstName ? this.state.firstName : "");
        formData.append('middleName', this.state.middleName ? this.state.middleName : "");
        formData.append('lastName', this.state.lastName ? this.state.lastName : "");

        formData.append('address1', this.state.address1 ? this.state.address1 : "");
        formData.append('address2', this.state.address2 ? this.state.address2 : "");
        formData.append('address3', this.state.address3 ? this.state.address3 : "");

        formData.append('deviceId', this.state.selectedMSISDN + Math.floor(new Date().getTime() / 1000));

        formData.append('deviceIsp', "");

        if (this.state.POIFront) {
            formData.append('poiFrontImage', this.state.POIFront);
        }
        if (this.state.POIBack) {
            formData.append('poiBackImage', this.state.POIBack);
        }
        if (this.state.visaImage) {
            formData.append('visaImage', this.state.visaImage);
        }
        if (this.state.billingProof) {
            formData.append('billingProofImage', this.state.billingProof);
        }
        // if (this.state.customerPhoto) {
        //     formData.append('userImage', this.state.customerPhoto);
        // }
        if (this.state.customerSignature) {
            formData.append('userSignature', this.state.customerSignature);
        }
        
        var  iframe = document.getElementById("camraIframeId");
        var iWindow = iframe && iframe.contentWindow;
        var iDocument = iWindow && iWindow.document;
        var selfie = iDocument && iDocument.images[0]; 
        
        if(selfie && selfie.src){

            fetch(selfie.src)
            .then(res => res.blob())
            .then(blob => {
            const file = new File([blob], 'dot.png', blob)
            console.log("userfileblob", file); 
            formData.append('userImage', file);
            this.submitTheData(formData); 
            })

        }else{
            console.log("withoutimage formdata",formData );
            this.submitTheData(formData); 
        }
    };

    

    dedupCheckSubmit = (e) => {
        e.preventDefault();

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (!this.state.poiNumber) {
            Notify.showError("Enter POI Number");
            return;
        }

        var keynum = Math.floor(Math.random() * 1E16);
        if (keynum.toString().length == 15) {
            keynum = keynum.toString() + "9";
        }
        var atualkey = (keynum * 69 - 99).toString();
        atualkey = atualkey.substring(0, 15);
        var poiNumberEncrypted = CryptoJS.AES.encrypt(this.state.poiNumber, atualkey).toString() + keynum;

        let data = {
            "poiNumber": poiNumberEncrypted,
            "poiType": this.state.poiType,
        }

        UserService.dedupCheck(data)
            .then(res => {

                var data = resolveResponse(res, "");

                if (data.status == 200) {

                    if (this.state.staticData.simType == "SUK") {
                        this.setState({ showSubmitForm: true });
                    } else if (this.state.staticData.numberReserved && this.state.staticData.msisdn) {
                        if (window.confirm("Mobile number " + this.state.staticData.msisdn + " is already reserved. Do you want to continue with the same number?")) {
                            this.resurveYourNumber(e);
                        } else {
                            this.setState({ showNumberSearch: true });
                        }
                    } else if (!this.state.staticData.numberReserved && this.state.staticData.msisdn) {
                        this.setState({ showSubmitForm: true });
                    } else if (!this.state.staticData.numberReserved && !this.state.staticData.msisdn) {
                        this.setState({ showNumberSearch: true });
                    }

                    this.setState({ submitLoader: false, showDedupeFlag: false });
                    localStorage.setItem('selectedMSISDN', this.state.mobileNumber);

                } else {
                    this.setState({ submitLoader: false });
                    if (data.status == 1010 || data.status === 500) {
                        localStorage.clear();
                        window.location.replace('#/login');
                    }
                }
            });


    };

    cynNumberCheck = (fromWhere) => {

        console.log("this.state.countNext10Click", this.state.countNext10Click, "fromWhere", fromWhere)
        if (fromWhere == "next10" && this.state.countNext10Click >= 2) {
            Notify.showError("Next 10 click limit over,  search fresh!");
            this.setState({ disableNext10Button: true, cynNumberCheckFlag: true });
            return;
        }

        if (fromWhere == "next10") {
            this.setState({ cynNumberCheckFlag: false });
        }


        if (!this.state.numberPattern) {
            Notify.showError("Number Pattern required");
            return;
        }

        if (fromWhere != "next10") {
            this.setState({ countNext10Click: 0, listOfNumbers: [] });
        }

        UserService.cynNumberSearch(this.state.numberPattern)
            .then(res => {

                var data = resolveResponse(res, "");

                this.setState({ disableNext10Button: false });


                if (data.status == 200) {

                    if (fromWhere == "next10") {
                        let count = this.state.countNext10Click;
                        this.setState({ countNext10Click: count + 1 });
                    }

                    data.result.forEach(element => {
                        this.setState({ listOfNumbers: [...this.state.listOfNumbers, element] });
                    });

                    this.setState({ cynNumberCheckFlag: true });

                } else {
                    this.setState({ submitLoader: false });
                    if (data.status == 1010 || data.status === 500) {
                        localStorage.clear();
                        window.location.replace('#/login');
                    }
                }
            });


    };

    resurveYourNumber = (e) => {
        e.preventDefault();

        //show only
        //this.setState({ showSubmitForm: true , showNumberSearch: false});

        if (!this.state.selectedMSISDN) {
            Notify.showError("Select a MSISDN Number");
            return;
        }


        UserService.cynReserveNumber(this.state.selectedMSISDN)
            .then(res => {

                // var data = resolveResponse(res, "");

                if (res.data.status == 200 || res.data.status == 1156) {
                    localStorage.setItem("activationNumber", this.state.selectedMSISDN);
                    this.setState({ showSubmitForm: true, showNumberSearch: false });
                } else {
                    this.setState({ submitLoader: false });
                    if (res.data.status == 1010 || res.data.status === 500) {
                        localStorage.clear();
                        window.location.replace('#/');
                    }
                }
            });

    };


    cancel = (e) => {
        if (localStorage.getItem('fromSubmit') == 'yes') {
            //  this.props.history.push('/resubmit-dataentry');
        } else {
            // this.props.history.push('/dataentry');
        }
    };

    onChangeAlternateNo = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value) && e.target.value.length <= 10) {
            this.setState({ [e.target.name]: e.target.value })
        } else {
            this.setState({ [e.target.name]: e.target.value.replace(/[^0-9]/g, '').substring(0, 10) })
        }
    }

    updateBillingProofFlag = () => {

        if (this.state.nationality === "SRILANKAN") {
            this.setState({ isBillingProofMandatry: this.state.staticData.diyAcivationNicBillingProofImage ? true : false });
        }

        if (this.state.nationality === "FOREIGNER") {
            this.setState({ isBillingProofMandatry: this.state.staticData.diyAcivationForeignerBillingProofImage ? true : false });
        }

        if (this.state.poiType == 'PASSPORT' && this.state.nationality === "SRILANKAN") {
            this.setState({ isBillingProofMandatry: this.state.staticData.diyAcivationSrilankaPassportBillingProofImage ? true : false });
            this.setState({ isBillingProofMandatry: this.state.staticData.diyAcivationNicBillingProofImage ? true : false });
        }

        if (this.state.poiType === "DL") {
            this.setState({ isBillingProofMandatry: this.state.staticData.diyAcivationDLBillingProofImage ? true : false });
        }

    }

    onChangeDedup = (e) => {

        const re = /^[0-9A-Za-z\b]+$/;
        if (e.target.name === 'poiNumber' && re.test(e.target.value) && e.target.value.length <= 12) {
            this.setState({ [e.target.name]: e.target.value })
        } else {
            this.setState({ [e.target.name]: e.target.value.replace(/[^0-90-9A-Za-z]/g, '').substring(0, 12) })
        }

    }

    onChangeSelectNumber = (e) => {
        this.setState({ [e.target.name]: e.target.value }, function () {
            this.setState({ disableNext10Button: true });
        });





    }


    onChange = (e) => {
        var data = e.target.value.trim();

        var test = !data.includes("$") && !data.includes("&");
        if (test) {
            if (e.target.name == "firstName" && /^[a-zA-Z ]+$/.test(e.target.value) && e.target.value.length <= 64) {
                this.setState({ [e.target.name]: e.target.value.toUpperCase() });
            } else if (e.target.name == "middleName" || e.target.name == "lastName") {
                if (/^[a-zA-Z ]+$/.test(e.target.value)) {
                    this.setState({ [e.target.name]: e.target.value.toUpperCase() });
                }
            } else if (e.target.name == "address1" || e.target.name == "address2" || e.target.name == "address3" || e.target.name == "presentAddress1") {
                if (/^[a-zA-Z0-9-#,./ ]+$/.test(e.target.value)) {
                    this.setState({ [e.target.name]: e.target.value.toUpperCase() });
                }
            } else if (e.target.name != "firstName") {
                this.setState({ [e.target.name]: e.target.value });
            }
        }

        if (e.target.name == "nationality" || e.target.name == "poiType") {
            if ((this.state.poiType == 'PASSPORT' && e.target.name == "nationality" && e.target.value == "FOREIGNER") || (this.state.nationality == 'FOREIGNER' && e.target.name == "poiType" && e.target.value == "PASSPORT")) {
                this.setState({ visaSectionVisible: true });
            } else {
                this.setState({ visaSectionVisible: false, visaNumber: "" });
            }
        }

        if (e.target.name == "poiType" && e.target.value == "NIC") {
            this.setState({ NicOnlyFlag: true });
        } else {
            this.setState({ NicOnlyFlag: false });
        }

        if (e.target.name == "poiType" && e.target.value == "NIC" || e.target.value == "DL") {
            this.setState({ nationality: 'SRILANKAN' });
        }

        if (e.target.name == "title" && e.target.value == "Ms" || e.target.value == 'Mrs') {
            this.setState({ gender: "F" });
        }
        if (e.target.name == "title" && e.target.value == "Mr") {
            this.setState({ gender: "M" });
        }

        if (e.target.name == "declarationCheckbox" && e.target.checked) {
            this.setState({ isDeclarationChecked: true, isSubmitButtonEnable: true });
        } else if (e.target.name == "declarationCheckbox" && !e.target.checked) {
            this.setState({ isDeclarationChecked: false, isSubmitButtonEnable: false });
        }

        if (e.target.name == "poiType" || e.target.name == "nationality") {

            setTimeout(() => {
                this.updateBillingProofFlag()
            }, 100);

        }


        if (e.target.name == "PresentAddCheckbox" && e.target.checked) {
            this.setState({ isPresentAddDiffrent: true, isBillingProofMandatry: true });
        } else if (e.target.name == "PresentAddCheckbox" && !e.target.checked) {
            this.setState({ isPresentAddDiffrent: false, presentAddress1: "", isBillingProofMandatry: false });
        }


        if (e.target.value.length == 0) {
            this.setState({ [e.target.name]: '' });
        }

    }
    onChangeAlphaNum = (e) => {
        const re = /^[0-9A-Za-z\b]+$/;
        if (e.target.value === '' || re.test(e.target.value) && e.target.value.length <= 12) {
            this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        } else {
            this.setState({ [e.target.name]: e.target.value.replace(/[^0-90-9A-Za-z]/g, '').substring(0, 12).toUpperCase() })
        }
    }


    onChangeEmail = (e) => {

        if (/^[a-zA-Z0-9@. ]+$/.test(e.target.value)) {
            this.setState({ [e.target.name]: e.target.value.trim() });
        }
        if (e.target.value.length == 0) {
            this.setState({ [e.target.name]: '' });
        }
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(e.target.value)) {
            document.getElementById("emailid").style.color = "red";
        } else {
            document.getElementById("emailid").style.color = "currentColor";
        }
    }


    loadCamra = () => {
        this.setState({takeSelfie : true}); 
        document.getElementById('camraIframeId') && document.getElementById('camraIframeId').contentWindow.location.reload(true);
    }

    render() {

        const dateParam = {
            myCallback: this.myCallback,
            visaExpiry: this.state.visaExpiry,
            endDate: '',
            resubmitVisaShow: this.state.resubmitVisaShow
        }




        return (
            <React.Fragment>
                <PostLoginNavBar />



                <Grid direction="row" container className="flexGrow" spacing={1} style={{ padding: "10px", justifyContent: 'center' }}>



                    <DialogboxSubmitSucess />


                    <Grid item xs={12} sm={8}>
                        <br />


                        {this.state.showDedupeFlag ? <Paper style={{ padding: "10px" }}>
                            <Grid direction="row" container className="flexGrow" spacing={1}>

                                <Grid item xs={12} sm={12}>
                                    <Typography variant="h6" style={{ textAlign: "center" }} color="primary"> Dedupe Check </Typography>
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <InputLabel required={true} >POI Type | POI වර්ගය | POI வகை</InputLabel>

                                    <FormControl style={styles.selectStyle}>
                                        <Select variant="outlined" value={this.state.poiType} name="poiType" onChange={this.onChange}>
                                            <MenuItem value={"NIC"}>NIC</MenuItem>
                                            <MenuItem value={"DL"}>DL</MenuItem>
                                            <MenuItem value={"PASSPORT"}>PASSPORT</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={3}>
                                    <InputLabel> POI Number  </InputLabel>
                                    <TextField variant="outlined" value={this.state.poiNumber} fullWidth name="poiNumber" onChange={this.onChangeDedup} />
                                </Grid>

                                <Grid item xs={12} sm={3}>

                                    <Button variant="contained" desable onClick={this.dedupCheckSubmit} color={'primary'} style={{ marginTop: '25px' }}> Submit | ඉදිරිපත් කරන්න | சமர்ப்பிக்கவும் </Button>

                                </Grid>
                            </Grid>
                        </Paper> : ""}


                        {this.state.showNumberSearch && this.state.staticData.simType != "SUK" ?
                            <Paper style={{ padding: '20px' }}>
                                <Grid direction="row" container className="flexGrow" spacing={1}>
                                    {/* <Grid item xs={12} sm={12}>
                                        <Typography variant="h6" style={{ textAlign: "left" }} color="primary"> Number Search and Reserve </Typography>
                                    </Grid> */}


                                    <Grid item xs={12} sm={3} item style={{ textAlign: "left" }} >
                                        <Typography variant="h6" color="primary" style={{ textAlign: "center" }} >  Choose your new airtel Number </Typography>

                                        <TextField variant="outlined" type="number" value={this.state.numberPattern} label=" Type your number pattern " style={{ width: "100%" }} name="numberPattern" onChange={this.onChange} />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>

                                        <Button variant="contained" onClick={this.cynNumberCheck} color={'primary'} style={{ marginTop: "10%" }}> Click to Search </Button>

                                    </Grid>

                                    <Grid item xs={12} sm={12} item style={{ textAlign: "left" }} >

                                        <FormControl component="fieldset">
                                            <RadioGroup onChange={this.onChangeSelectNumber} row aria-label="position" name="selectedMSISDN" defaultValue="top">


                                                {this.state.listOfNumbers && this.state.listOfNumbers.map((item, j) => (
                                                    <FormControlLabel value={item} control={<Radio size="large" style={{ fontSize: "20px" }} color="primary" />} label={item} />
                                                ))}


                                            </RadioGroup>
                                        </FormControl>



                                    </Grid>


                                    <Grid direction="row" container justify="space-between" className="flexGrow" spacing={1}>
                                        <Grid item   >




                                        </Grid>
                                        <Grid item style={{ marginRight: "40px" }}>


                                            {this.state.cynNumberCheckFlag ?
                                                <Button variant="contained" disabled={this.state.disableNext10Button} onClick={() => this.cynNumberCheck("next10")} style={{ marginTop: "0%", float: "right" }}> Next 10 </Button>
                                                :
                                                <Spinner />
                                            }

                                        </Grid>
                                    </Grid>


                                    <Grid item xs={12} sm={3}>


                                        <Typography variant="h6" color="primary">   Selected Number: {this.state.selectedMSISDN}  </Typography>


                                    </Grid>

                                    <Grid item xs={12} sm={4}>

                                        <Button variant="contained" onClick={this.resurveYourNumber} color={'primary'}> Reserve your Number </Button>

                                    </Grid>



                                </Grid>
                            </Paper>
                            : ""}


                        {this.state.showSubmitForm ? <Paper style={{ padding: "20px" }}>

                            <Typography variant="h6" style={{ textAlign: "center" }} color="primary"> Please enter your Ownership Details <br />කරුණාකර ඔබේ හිමිකාරිත්ව තොරතුරු ඇතුළත් කරන්න <br /> தயவுசெய்து உங்களுடைய உரிமையாளர் விபரங்களை உள்ளிடவும் </Typography>


                            <form id="dataentryform" style={styles.formContainer}>

                                <Grid spacing={1} container direction="row">
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>SIM Reference  </InputLabel>
                                        <TextField variant="outlined" label="" disabled={true} fullWidth name="simRefNumber" value={localStorage.getItem('simRefNumber')} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>SIM Type</InputLabel>
                                        <TextField variant="outlined" label="" disabled={true} fullWidth name="" value={this.state.staticData && this.state.staticData.simType} />
                                    </Grid>


                                </Grid>



                                <Grid spacing={1} container direction="row">

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>SIM Number</InputLabel>
                                        <TextField variant="outlined" disabled={true} value={this.state.staticData && this.state.staticData.simNumber} fullWidth name="poiNumber" onChange={this.onChangeAlternateNo} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>First Time Recharge Amount </InputLabel>
                                        <TextField variant="outlined" disabled={true} value={this.state.staticData && this.state.staticData.ftrAmount} fullWidth name="poiNumber" onChange={this.onChangeAlternateNo} />
                                    </Grid>

                                </Grid>


                                <Grid spacing={1} container direction="row">
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Selected Mobile Number | ජංගම දූරකථන අංකය | தொலைபேசி எண்</InputLabel>

                                        <TextField variant="outlined" label="" disabled={true} fullWidth name="" value={this.state.selectedMSISDN} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>NIC Number | ජා. හැ. අංකය | தே. அ. அ. எண்</InputLabel>
                                        <TextField variant="outlined" disabled={true} value={this.state.poiNumber} fullWidth name="poiNumber" onChange={this.onChangeAlternateNo} />
                                    </Grid>
                                </Grid>


                                <Grid spacing={1} container direction="row" className="GridTopSpaceing">
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel required={true} >POI Type | POI වර්ගය | POI வகை</InputLabel>

                                        <FormControl style={styles.selectStyle}>
                                            <Select disabled={true} variant="outlined" value={this.state.poiType} name="poiType" onChange={this.onChange}>
                                                <MenuItem value={"NIC"}>NIC</MenuItem>
                                                <MenuItem value={"DL"}>DL</MenuItem>
                                                <MenuItem value={"PASSPORT"}>PASSPORT</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel required={true} htmlFor="gender">Nationality | ජාතිය | தேசியம்</InputLabel>

                                        <FormControl style={styles.selectStyle}>
                                            <Select variant="outlined" value={this.state.nationality} name="nationality" onChange={this.onChange}>
                                                <MenuItem value={"SRILANKAN"}> Sri Lankan | ශ්‍රී ලාංකික | இலங்கை </MenuItem>
                                                {this.state.poiType == "PASSPORT" ? <MenuItem value={"FOREIGNER"}>Foreigner | ශ්‍රී ලාංකික නොවන | வெளிநாட்டவர்</MenuItem> : []}

                                            </Select>
                                        </FormControl>

                                    </Grid>
                                </Grid>



                                {this.state.visaSectionVisible ? <>

                                    <Grid spacing={1} container direction="row">
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel required={true} htmlFor="gender">Visa Number | වීසා අංකය | விசா எண்</InputLabel>

                                            <TextField variant="outlined" value={this.state.visaNumber} fullWidth name="visaNumber" onChange={this.onChangeAlphaNum} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} style={{ marginTop: '0px' }}>
                                            <MaterialUIPickers callbackFromParent={dateParam} />
                                        </Grid>

                                    </Grid>

                                </> : ""}

                                <Grid spacing={1} container direction="row">
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel required={true} htmlFor="title">Title | ආමන්ත්‍රණය | முன் தலைப்பு</InputLabel>

                                        <FormControl style={styles.selectStyle}>
                                            <Select variant="outlined" value={this.state.title} name="title" onChange={this.onChange}>
                                                <MenuItem value={"Mr"}>Mr</MenuItem>
                                                <MenuItem value={"Mrs"}>Mrs</MenuItem>
                                                <MenuItem value={"Ms"}>Ms</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel required={true} htmlFor="gender">Gender | ස්ත්‍රී පුරුෂ භාවය | பால்</InputLabel>

                                        <FormControl style={styles.selectStyle}>
                                            <Select variant="outlined" value={this.state.gender} name="gender" onChange={this.onChange}>
                                                <MenuItem value={"M"}>Male</MenuItem>
                                                <MenuItem value={"F"}>Female</MenuItem>
                                                <MenuItem value={"O"}>Others</MenuItem>


                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>


                                <Grid spacing={1} container direction="row">
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>First Name | මුල් නම | முதல் பெயர்</InputLabel>
                                        <TextField variant="outlined" value={this.state.firstName} required={true} fullWidth name="firstName" onChange={this.onChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Middle Name | වෙනත් නම් | நடுப்பெயர்</InputLabel>
                                        <TextField variant="outlined" value={this.state.middleName} fullWidth name="middleName" onChange={this.onChange} />
                                    </Grid>


                                </Grid>


                                <Grid spacing={1} container direction="row" className="GridTopSpaceing">
                                    <Grid item xs={12} sm={6} >
                                        <InputLabel>Last Name | වාසගම | இறுதிப்பெயர்</InputLabel>

                                        <TextField variant="outlined" label="" value={this.state.lastName} fullWidth name="lastName" onChange={this.onChange} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Alternate Number | විකල්ප අංකය | வேறு எண்(7XXXXXXXX)</InputLabel>
                                        <TextField disabled={true} label="" variant="outlined" fullWidth name="alternateNumber" value={this.state.alternateNumber} onChange={this.onChangeAlternateNo} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Email | විද්‍යුත් තැපෑල | மின்னஞ்சல்</InputLabel>
                                        <TextField variant="outlined" id="emailid" label="" fullWidth name="emailid" value={this.state.emailid} onChange={this.onChangeEmail} />
                                    </Grid>

                                </Grid>

                                <Grid spacing={1} container direction="row">

                                    <Grid item xs={12} sm={12}>

                                        <br />
                                        <InputLabel style={{ fontStyle: 'italic' }}><b>  Permanent Address |	ස්ථීර ලිපිනය | நிரந்தர முகவரி</b></InputLabel>

                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <InputLabel>House No |	නිවෙස් අංකය | இலக்கம்</InputLabel>
                                        <TextField variant="outlined" label="" value={this.state.address1} fullWidth name="address1" onChange={this.onChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InputLabel>Road/Lane |	පාර | வீதி/  ஒழுங்கை</InputLabel>
                                        <TextField variant="outlined" label="" value={this.state.address2} fullWidth name="address2" onChange={this.onChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <InputLabel>Town | නගරය | நகரம்</InputLabel>
                                        <TextField variant="outlined" label="" value={this.state.address3} fullWidth name="address3" onChange={this.onChange} />
                                    </Grid>

                                </Grid>


                                <Grid spacing={1} container direction="row">
                                    <Grid item xs={12} sm={12}>
                                        <br />
                                        <FormControlLabel
                                            value="All"
                                            control={<Checkbox onChange={this.onChange} name="PresentAddCheckbox" color="primary" />}
                                            label="Present address is different from permanent address | වර්තමාන ලිපිනය, ස්ථිර ලිපිනයට වෙනස් වේ | தற்போதைய முகவரி நிரந்தர முகவரியிலிருந்து வேறுபட்டது"
                                            labelPlacement="right"
                                        />
                                    </Grid>

                                    {this.state.isPresentAddDiffrent ?
                                        <Grid item xs={12} sm={12}>
                                            <InputLabel>Present Address | වර්තමාන ලිපිනය | தற்போதைய முகவரி</InputLabel>
                                            <TextField label="" variant="outlined" value={this.state.presentAddress1} fullWidth name="presentAddress1" onChange={this.onChange} />
                                        </Grid> : ""}
                                </Grid>

                                <br />

                                <Typography variant="body1" style={{ textAlign: "left" }} color="primary">Document Upload | ලේඛන ඇතුලත් කිරීම | ஆவணப்பதிவேற்றம்</Typography>
                                <InputLabel style={{ fontSize: '14px' }}>Note: Please upload clear photos of your Proof of Identity (POI) and Billing Proof. (Maximum size of an image should be 5MB) <br /><br /> කරුණාකර ඔබේ හැදුනුම්පතෙහි සහ බිල්පතෙහි පැහැදිලි ඡායාරූප ඇතුළත් කරන්න.
                                    ඡායාරූපයේ උපරීම ධාරිතාව 5MB වේ. <br /><br />  உங்கள் அடையாளச் சான்று மற்றும் பட்டியல் ஆதாரத்தின் தெளிவான புகைப்படங்களை பதிவேற்றவும். (ஒரு படத்தின் அதிகபட்ச அளவு 5MB ஆக இருக்க வேண்டும்) <br /> <br /></InputLabel>

                                <Grid spacing={1} container direction="row">

                                    <Grid item xs={12} sm={6}>
                                        <Paper style={{ padding: '15px' }}>

                                            <Grid spacing={1} container direction="row">
                                            <Grid item xs={12} sm={12}>
                                                    {/* <InputLabel htmlFor="Front">Capture Photo</InputLabel>
                                                    */}
                                                     <InputLabel htmlFor="Front">Customer Photo | පාරිභෝගික ඡායාරූපය | வாடிக்கையாளர் புகைப்படம்</InputLabel>

                                                    <Button id="takeNew" variant="contained" onClick={() => this.loadCamra()} >  Capture Photo </Button>

                                                    {/* <CamraLivePhoto /> */}


                                                   

                                                </Grid>

                                                {/* <Grid item xs={12} sm={6}>
                                                    <InputLabel htmlFor="Front">Customer Photo | පාරිභෝගික ඡායාරූපය | வாடிக்கையாளர் புகைப்படம்</InputLabel>
                                                    <br />
                                                    <FormControl style={styles.multiselect}>
                                                        <input
                                                            id="Front"
                                                            style={{
                                                                marginTop: "0px",
                                                                marginLeft: "3px"
                                                            }}
                                                            type="file"
                                                            name="customerPhoto"
                                                            onChange={this.onChangeFileUpload}
                                                        />
                                                    </FormControl>

                                                </Grid> */}
                                                


                                                {this.state.takeSelfie ? <Grid item xs={12} sm={12} style={{width: '100%', height: "300px"}}>

                                                    <iframe id="camraIframeId" frameBorder="0" style={{width: 'inherit' , height: '-webkit-fill-available'}}  src={DEV_PROTJECT_PATH + "live-photo.html"}  > </iframe>
                                           
                                                </Grid>: ""} 
                                            </Grid>
                                        </Paper>
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <Paper style={{ padding: '15px' }}>

                                            <Grid spacing={1} container direction="row">
                                                <Grid item xs={12} sm={12}>
                                                    <InputLabel htmlFor="Front" required={true}>POI Front Image | POI ඉදිරිපස රූපය | POI முன் படம்</InputLabel>
                                                    <br />
                                                    <FormControl style={styles.multiselect}>
                                                        <input
                                                            id="Front"
                                                            style={{
                                                                marginTop: "0px",
                                                                marginLeft: "3px"
                                                            }}
                                                            type="file"
                                                            name="POIFront"
                                                            onChange={this.onChangeFileUpload}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={12}>
                                                    {this.state.POIFront ? <img title="Preview POI Front" style={styles.imageStyle} src={this.state.POIFrontUrl} /> : ""}
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <Paper style={{ padding: '15px' }}>

                                            <Grid spacing={1} container direction="row">
                                                <Grid item xs={12} sm={12}>
                                                    <InputLabel htmlFor="Front" required={this.state.NicOnlyFlag || this.state.poiType == 'NIC'}>POI Back Image | POI පසුපස රුපය | POI பின் படம் </InputLabel>
                                                    <br />
                                                    <FormControl style={styles.multiselect}>
                                                        <input
                                                            id="Front"
                                                            style={{
                                                                marginTop: "0px",
                                                                marginLeft: "3px"
                                                            }}
                                                            type="file"
                                                            name="POIBack"
                                                            onChange={this.onChangeFileUpload}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={12}>
                                                    {this.state.POIBack ? <img title="Preview POI Back" style={styles.imageStyle} src={this.state.POIBackUrl} /> : ""}
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <Paper style={{ padding: '15px' }}>

                                            <Grid spacing={1} container direction="row">
                                                <Grid item xs={12} sm={12}>
                                                    <InputLabel htmlFor="Front" required={this.state.isBillingProofMandatry}>Billing Proof | බිල්පත් සාක්ෂි	| பட்டியல் ஆதாரம்</InputLabel>
                                                    <br />
                                                    <FormControl style={styles.multiselect}>
                                                        <input
                                                            id="Front"
                                                            style={{
                                                                marginTop: "0px",
                                                                marginLeft: "3px"
                                                            }}
                                                            type="file"
                                                            name="billingProof"
                                                            onChange={this.onChangeFileUpload}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={12}>
                                                    {this.state.billingProof ? <img title="Billing Proof" style={styles.imageStyle} src={this.state.billingProofUrl} /> : ""}
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>



                                    {this.state.visaSectionVisible ?
                                        <Grid item xs={12} sm={6}>
                                            <Paper style={{ padding: '15px' }}>

                                                <Grid spacing={1} container direction="row">
                                                    <Grid item xs={12} sm={12}>
                                                        <InputLabel required={this.state.staticData.diyAcivationVisaImage} htmlFor="Front">Visa Photo | වීසා ඡායාරූපය | விசா புகைப்படம்</InputLabel>
                                                        <br />

                                                        <FormControl style={styles.multiselect}>
                                                            <input
                                                                id="Front"
                                                                style={{
                                                                    marginTop: "0px",
                                                                    marginLeft: "3px"
                                                                }}
                                                                type="file"
                                                                name="visaImage"
                                                                onChange={this.onChangeFileUpload}
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} sm={12}>
                                                        {this.state.visaImage ? <img title="Visa Proof" style={styles.imageStyle} src={this.state.visaImageUrl} /> : ""}
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid> : ""}



                                    <Grid item xs={12} sm={6}>
                                        <Paper style={{ padding: '15px' }}>

                                            <Grid spacing={1} container direction="row">

                                                <Grid item xs={12} sm={12}>

                                                    <InputLabel htmlFor="Front" required={true}>Customer Signature | පාරිභෝගික අත්සන | வாடிக்கையாளர் கையொப்பம்</InputLabel>            <br />
                                                    <InputLabel style={{ fontSize: 'smaller' }}>Note: Please place your signature on a paper and capture.  |	කරුණාකර ඔබේ අත්සන කඩදාසියක් මත  සටහන් කර ජයාරූපගත කරන්න | உங்கள் கையொப்பத்தை ஒரு காகிதத்திலிட்டு  புகைப்படம் எடுக்கவும். </InputLabel>

                                                    <br /> <br />
                                                    <FormControl style={styles.multiselect}>
                                                        <input
                                                            id="Front"
                                                            style={{
                                                                marginTop: "0px",
                                                                marginLeft: "3px"
                                                            }}
                                                            type="file"
                                                            name="customerSignature"
                                                            onChange={this.onChangeFileUpload}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={12}>
                                                    {this.state.customerSignature ? <img title="Customer Photo" style={styles.imageStyle} src={this.state.customerSignatureUrl} /> : ""}
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>


                                </Grid>





                                <Grid spacing={1} container direction="row">
                                    <Grid item xs={12} sm={12}>
                                        <br />

                                        <div style={{ fontSize: '12px' }}>


                                            <FormControlLabel
                                                value="All"
                                                control={<Checkbox onChange={this.onChange} name="declarationCheckbox" color="primary" />}
                                                label="Declaration | ප්‍රකාශනය | உறுதிப்படுத்தல்"
                                                labelPlacement="right"
                                            />
                                            <br />
                                            {this.state.staticData && this.state.staticData.acqCustomerDeclarationUS && Parser(this.state.staticData.acqCustomerDeclarationUS)}

                                            {/* I/ We represent that I/ we have been fully informed about the service provided by Airtel. I/ We agree and hereby provide the consent to verify the authenticity of the particulars related to the National Identity Card via the information system of the Department for Registration of Persons. I/ We further agree and provide the consent for Airtel to share my personal details not limited to NIC details with the parties mentioned under the terms and conditions in order to provide any additional services to me/ us if required.  I/We declare that I/we have access to the internet and that I/we have read and understood the terms and conditions hosted on www.airtel.lk and unconditionally accept them as binding on me/ us. Furthermore, I/ we certify and confirm that the information provided by me/ us is true and correct. */}
                                        </div>

                                    </Grid>
                                </Grid>

                                <Grid spacing={1} container direction="row" justify="space-between" >

                                    <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
                                        <br />

                                        {this.state.submitLoader ? <Spinner /> : <Button disabled={!this.state.isSubmitButtonEnable} variant="contained" desable onClick={this.submitDataEntry} color={'primary'} style={{ marginLeft: '20px' }}> Submit | ඉදිරිපත් කරන්න | சமர்ப்பிக்கவும் </Button>}

                                    </Grid>
                                </Grid>

                            </form>
                        </Paper>
                            : ""}


                    </Grid>




                </Grid>


            </React.Fragment>
        )
    }



}

const styles = {
    formContainer: {
        display: 'flex',
        flexFlow: 'row wrap'
    },

    textStyle: {
        display: 'flex',
        justifyContent: 'center'

    },
    imgStyle: {
        display: 'flex'
    },

    selectStyle: {
        minWidth: '100%',
        marginBottom: '10px'
    },
    MuiTextField: {
        overflowY: 'scroll',
        fontSize: "12px",
        maxHeight: "50px",

    },
    footerButton: {
        position: 'fixed',
        left: 0,
        bottom: '20px',
        width: '100%',
        textAlign: 'right'
    },
    imageStyle: {
        objectFit: 'cover',
        width: "100%",
        marginTop: '5px',
        height: "100%"
    }

};

export default DataEntryEdit;