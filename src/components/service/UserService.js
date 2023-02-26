import axios from 'axios';
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getCveBreakdown() {
        return axios.get(apiConstant.GET_CVE_BREAKDOWN, '');
    }

      
    async getCveAffectedComputers() {
        return axios.get(apiConstant.GET_CVE_AFFECTED_COMPUTERS, '');
    }

    async getCveGroups() {
        return axios.get(apiConstant.GET_CVE_GROUPS, '');
    }

    async getCves() {
        return axios.get(apiConstant.GET_CVE_DETAILS, '');
    }
} 

export default new UserService();
