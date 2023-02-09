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

    async getCalibrations() {
        return axios.get(apiConstant.GET_CALIBRATIONS, '');
    }

    async getSuppressions() {
        return axios.get(apiConstant.GET_SUPPRESSIONS, '');
    }
    async getFalsePositive() {
        return axios.get(apiConstant.GET_FALSE_POSITIVE, '');
    }

    async getChangeTickets(hc_cycle) {
        return axios.get(apiConstant.GET_CHANGE_REQUEST+"?hc_cycle="+hc_cycle, '');
    }
    
    async getCycleDetails(id) {
        return axios.get(apiConstant.GET_CYCLE_DETAILS + id, '');
    }

    async getScanDetails(id) {
        return axios.get(apiConstant.GET_UNSCANNED + id, '');
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

    async deleteHCCycle(selectedHCNo) {
        return axios.delete(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo , { data: '' } );
    }

    async deleteChangeRequest(selectedHCNo) {
        return axios.delete(apiConstant.CHANGE_REQUEST + selectedHCNo , { data: '' } );
    }

    async updateHCCycle(selectedHCNo, data) {
        return axios.patch(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo , data );
    }

    async createHCCycle(param) {
        return axios.post(apiConstant.CREATE_HC_CYCLE, param);
    }

    async login(param) {
        return axios.post(apiConstant.CREATE_HC_CYCLE, param);
    }

    async createChangeTicket(param) {
        return axios.post(apiConstant.CHANGE_REQUEST, param);
    }

    async updateChangeTicket(Id, data) {
        return axios.patch(apiConstant.CHANGE_REQUEST + Id , data );
    }

    

} 

export default new UserService();
