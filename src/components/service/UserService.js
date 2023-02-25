import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    async getCveBreakdown() {
        return axios.get(apiConstant.GET_CVE_BREAKDOWN, '');
    }

} 

export default new UserService();
