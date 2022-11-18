import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getDeviations(hccycleName, scanDate, policyName) {
        if(hccycleName && policyName){
            return axios.get(apiConstant.GET_DEVIATIONS+ policyName +"?hc_cycle="+hccycleName, '');
        }else if(scanDate && policyName){
            return axios.get(apiConstant.GET_DEVIATIONS+ policyName +"?job_id="+scanDate, '');
        }
    }

    async getPolicies() {
        return axios.get(apiConstant.GET_POLICIES, '');
    }

    async getHCCycles() {
        return axios.get(apiConstant.GET_HC_CYCLES, '');
    }
    
    async getCycleDetails(id) {
        return axios.get(apiConstant.GET_CYCLE_DETAILS + id, '');
    }

    async getCycleHostnames(id, dashboardType) {
        if(dashboardType === "unassignedScan"){
            return axios.get(apiConstant.GET_SCANNED_HOSTNAMES + id + '/hosts', '');

        }else{
            return axios.get(apiConstant.GET_CYCLE_HOSTNAMES + id + '/hosts', '');
        }
    }

    async getScannedDates() {
        return axios.get(apiConstant.GET_SCANNED_DATES, '');
    }

    async addToHCCycle(selectHealthCheck, selectionModel) {
        return axios.post(apiConstant.GET_CYCLE_HOSTNAMES + selectHealthCheck + '/add', selectionModel);
    }

    async deleteScanfromHCCycle(selectedHCNo, scanIds) {

        return axios.delete(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo + '/delete', { data: scanIds } );
    }

    async createHCCycle(param) {
        return axios.post(apiConstant.CREATE_HC_CYCLE, param);
    }

    

} 

export default new UserService();
