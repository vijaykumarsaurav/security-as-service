import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getCycleDetails(id) {
        return axios.get(apiConstant.GET_CYCLE_DETAILS + id, '');
    }

    async addToHCCycle(selectHealthCheck, selectionModel) {
        return axios.post(apiConstant.GET_CYCLE_HOSTNAMES + selectHealthCheck + '/add', selectionModel);
    }

    async deleteScanfromHCCycle(selectedHCNo, scanIds) {

        return axios.delete(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo + '/delete', { data: scanIds } );
    }

    async updateHCCycle(selectedHCNo, data) {
        return axios.patch(apiConstant.GET_CYCLE_HOSTNAMES + selectedHCNo , data );
    }
} 

export default new UserService();
