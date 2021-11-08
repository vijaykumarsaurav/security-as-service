import { domain } from "process";

var RETAILER_API_BASE_URL = 'https://retailer.airtel.lk/SLRetailer/';
var STAGING_IP_PORT = 'https://125.16.74.160:30611/';
var DEV_IP_PORT = 'https://125.17.6.6/retailer/';
var templatePath = '',domainIpName=window.location.hostname; 

if(window.location.hostname == "retailer.airtel.lk"){
    RETAILER_API_BASE_URL = 'https://retailer.airtel.lk/SLRetailer/';
}

if(window.location.hostname == "125.17.6.6" && window.location.pathname == "/diy-prepaid/"){
    RETAILER_API_BASE_URL = 'https://125.17.6.6/retailer/SLRetailer/';
  //  RETAILER_API_BASE_URL = 'https://125.17.6.6/retailer_sit/SLRetailer/';
     templatePath =  '/mitradev';  
     domainIpName = '125.17.6.6'; 
 } 

 if(window.location.hostname == "tstretailer.airtel.lk"){
  RETAILER_API_BASE_URL = 'https://tstretailer.airtel.lk/SLRetailer/';
  domainIpName = 'tstretailer.airtel.lk'; 
}

if(window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost"){
     RETAILER_API_BASE_URL = 'https://125.17.6.6/retailer/SLRetailer/'; //dev
   //   RETAILER_API_BASE_URL = 'http://slretailer-service.development.slmitra.airtelworld.in/SLRetailer/';
     //RETAILER_API_BASE_URL = 'http://125.17.6.6/retailer_sit/SLRetailer/'; //sit public service
     domainIpName = '125.17.6.6'; 
  }
  
let devpath =''; 
if(window.location.hostname == '125.17.6.6')
  devpath ='/diy-prepaid/'; 
export const DEV_PROTJECT_PATH =  devpath; 
//login  /diy/kyc/validateOtpAndNIC
export const KYC_SEND_OTP_API = RETAILER_API_BASE_URL + 'diy/activation/sendOtp';
export const KYC_LOGIN_API = RETAILER_API_BASE_URL + 'diy/activation/validateOtpAndSim';
export const KYC_LOGOUT_API = RETAILER_API_BASE_URL + 'diy/activation/logout';
export const KYC_SUBMIT_API = RETAILER_API_BASE_URL + 'diy/activation/submit'; 
export const KYC_CHECK_SESSION_API = RETAILER_API_BASE_URL + 'diy/activation/checkSession';

export const KYC_DEDUP_CHECK = RETAILER_API_BASE_URL + 'diy/activation/dedupe'; 
export const KYC_CYN_NUMBER_CHECK = RETAILER_API_BASE_URL + 'diy/activation/cyn/numberCheck?pattern='; 
export const KYC_CYN_NUMBER_RESERVE = RETAILER_API_BASE_URL + 'diy/activation/cyn/numberReserve?msisdn='; 
export const KYC_DIY_CHECK_STATUS = RETAILER_API_BASE_URL + 'diy/activation/checkStatus'; 


