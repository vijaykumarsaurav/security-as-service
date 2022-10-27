import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getDeviations(hccycleName, policyName) {
        return axios.get(apiConstant.GET_DEVIATIONS+ policyName +"?hc_cycle="+hccycleName, '');
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

    async createHCCycle(param) {
        return axios.post(apiConstant.CREATE_HC_CYCLE, param);
    }

    

} 

export default new UserService();
