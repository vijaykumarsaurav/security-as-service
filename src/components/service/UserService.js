import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getDeviations(hccycleName, scanDate, policyName) {
        if(hccycleName && policyName){
            return axios.get(apiConstant.GET_DEVIATIONS+ policyName +"?hc_cycle="+hccycleName, AuthService.getRequestedCookie());
        }else if(scanDate && policyName){
            return axios.get(apiConstant.GET_DEVIATIONS+ policyName +"?job_id="+scanDate, AuthService.getRequestedCookie());
        }
    }

    async getPolicies() {
        return axios.get(apiConstant.GET_POLICIES, AuthService.getRequestedCookie());
    }

    async getHCCycles(selectedOrg) {
        return axios.get(apiConstant.GET_HC_CYCLES.replace("{OrgName}", selectedOrg), AuthService.getRequestedCookie());
    }

    async getCalibrations(policy) {
        console.log('poliiiiii', policy)
        let policyParam = ''
        if(policy) {
            policyParam = "?policyName=" + policy; 
        }
        return axios.get(apiConstant.GET_CALIBRATIONS + policyParam, AuthService.getRequestedCookie());
    }

    async getSuppressions(policy) {
        let policyParam = ''
        if(policy) {
            policyParam = "?policyName=" + policy; 
        }
        return axios.get(apiConstant.GET_SUPPRESSIONS + policyParam, AuthService.getRequestedCookie());
    }

    async getFalsePositive() {
        return axios.get(apiConstant.GET_FALSE_POSITIVE, AuthService.getRequestedCookie());
    }

    async getChangeTickets(hc_cycle) {
        return axios.get(apiConstant.GET_CHANGE_REQUEST+"?hc_cycle="+hc_cycle, AuthService.getRequestedCookie());
    }
    
    async getCycleDetails(id) {
        return axios.get(apiConstant.GET_CYCLE_DETAILS + id, AuthService.getRequestedCookie());
    }

    async getScanDetails(id) {
        return axios.get(apiConstant.GET_UNSCANNED + id, AuthService.getRequestedCookie());
    }

    async getCycleHostnames(id, dashboardType, OrgName) {
        if(dashboardType === "unassignedScan"){
            return axios.get(apiConstant.GET_SCANNED_HOSTNAMES.replace("{OrgName}", OrgName)  + id + '/hosts', AuthService.getRequestedCookie());

        }else{
            return axios.get(apiConstant.GET_CYCLE_HOSTNAMES.replace("{OrgName}", OrgName) + id + '/hosts', AuthService.getRequestedCookie());
        }
    }

    async getScannedDates(selectedOrg) {
        return axios.get(apiConstant.GET_SCANNED_DATES.replace("{OrgName}", selectedOrg), AuthService.getRequestedCookie());
    }

    async addToHCCycle(selectHealthCheck, selectionModel) {
        return axios.post(apiConstant.GET_CYCLE_HOSTNAMES + selectHealthCheck + '/add', selectionModel, AuthService.getRequestedCookie());
    }

    async deleteScanfromHCCycle(selectedHCNo, scanIds) {

        return axios.delete(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo + '/delete', { data: scanIds }, AuthService.getRequestedCookie() );
    }

    async deleteHCCycle(selectedHCNo) {
        return axios.delete(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo , AuthService.getRequestedCookie() );
    }

    async deleteChangeRequest(selectedHCNo) {
        return axios.delete(apiConstant.CHANGE_REQUEST + selectedHCNo, AuthService.getRequestedCookie() );
    }

    async deleteCalibrationSuppression(type, id) {
        if(type === 'calibration'){
            return axios.delete(apiConstant.DELETE_CALIBRATION + id, AuthService.getRequestedCookie() );
        }else{
            return axios.delete(apiConstant.DELETE_SUPPRESSION + id, AuthService.getRequestedCookie() );
        }
    }

    async updateHCCycle(selectedHCNo, data) {
        return axios.patch(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo , data, AuthService.getRequestedCookie() );
    }

    async createHCCycle(param) {
        return axios.post(apiConstant.CREATE_HC_CYCLE, param, AuthService.getRequestedCookie());
    }
    
    async whoAmI(base64String) {
        return axios.get(apiConstant.WHO_AM_I, AuthService.getAuthHeader(base64String));
    }

    async logout() {
        return axios.get(apiConstant.LOGOUT_API, AuthService.getRequestedCookie());
    }

    async getOrgList() {
        return axios.get(apiConstant.GET_ORG_LIST,AuthService.getRequestedCookie());
    }
    async getPolicyList(selectedOrg) {
        return axios.get(apiConstant.GET_POLICY_LIST.replace("{OrgName}", selectedOrg),AuthService.getRequestedCookie());
    }

    async getPolicyScansData(policy) {
        return axios.get(apiConstant.GET_POLICY_SCANS_DATA + policy,AuthService.getRequestedCookie());
    }

    async getCombinePolicyScansData(ids, selectedOrg) {
        return axios.get(apiConstant.GET_COMBIND_POLICY_DATA.replace("{OrgName}", selectedOrg) + "?scans=" + ids,AuthService.getRequestedCookie());
    }

    async createChangeTicket(param) {
        return axios.post(apiConstant.CHANGE_REQUEST, param, AuthService.getRequestedCookie());
    }

    async createCalibration(param, type) {

        if(type === 'calibration'){
            return axios.post(apiConstant.CREATE_CALIBRATION, param, AuthService.getRequestedCookie());
        }else{
            return axios.post(apiConstant.CREATE_SUPPRESSION, param, AuthService.getRequestedCookie());
        }

    }

    async updateCaliAndSupp(type, id, param) {

        if(type === 'calibration'){
            return axios.patch(apiConstant.UPDATE_CALIBRATION + id , param, AuthService.getRequestedCookie() );
        }else{
            return axios.patch(apiConstant.UPDATE_SUPPRESSION + id , param, AuthService.getRequestedCookie() );
        }

    }

    async updateChangeTicket(Id, data) {
        return axios.patch(apiConstant.CHANGE_REQUEST + Id , data, AuthService.getRequestedCookie() );
    }

    
    async getReportDetailsSuppression(id) {
        return axios.get(apiConstant.GET_REPORT_SUPPRESSTION_DETAILS + id,AuthService.getRequestedCookie());
    }

} 

export default new UserService();

