import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../../utils/config";

class UserService {

    sendOtp(credentials, key) {
        return axios.post(apiConstant.KYC_SEND_OTP_API, credentials, '');
    } 
    checkDiyStatus(credentials, key) {
        return axios.post(apiConstant.KYC_DIY_CHECK_STATUS, credentials, '');
    } 

    login(credentials, key) {
          return axios.post(apiConstant.KYC_LOGIN_API, credentials, '');
    } 
  
    logout() {
          return axios.get(apiConstant.KYC_LOGOUT_API, AuthService.getHeader());
    }

    submitData(formData) {
        return axios.post(apiConstant.KYC_SUBMIT_API, formData, AuthService.getHeader());

    } 
    dedupCheck(formData) {
        return axios.post(apiConstant.KYC_DEDUP_CHECK, formData, AuthService.getHeader());

    } 
    cynNumberSearch(numberPattern) {
        return axios.get(apiConstant.KYC_CYN_NUMBER_CHECK+numberPattern, AuthService.getHeader());
    }
    cynReserveNumber(selectedNumber) {
        return axios.get(apiConstant.KYC_CYN_NUMBER_RESERVE+selectedNumber, AuthService.getHeader());
    }

  

    checkSession(){
        return axios.get(apiConstant.KYC_CHECK_SESSION_API, AuthService.getHeader());
        
    }

} 

export default new UserService();
