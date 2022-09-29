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

} 

export default new UserService();
