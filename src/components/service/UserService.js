import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getDeviations() {
        return axios.get(apiConstant.GET_DEVIATIONS, '');
    }

    async getPolicies() {
        return axios.get(apiConstant.GET_POLICIES, '');
    }

    async getHCCycles() {
        return axios.get(apiConstant.GET_HC_CYCLES, '');
    }
    
    async getScannedDates() {
        return axios.get(apiConstant.GET_SCANNED_DATES, '');
    }

    

} 

export default new UserService();
