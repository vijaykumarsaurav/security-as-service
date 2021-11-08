import axios from 'axios';

import AuthService from "./AuthService";
import  * as apiConstant from "../utils/config";

class UserService {
  
    getCategory() {
          return axios.get(apiConstant.CATEGORIES_API, AuthService.getHeader());
    }

    getProductCategory(queryStr) {
        return axios.get(apiConstant.CATEGORY_PRODUCT_API+queryStr, AuthService.getHeader());
   }

   getProductDetails(productId) {
    return axios.get(apiConstant.PRODUCT_DETAILS_API+productId, AuthService.getHeader());
   }
   

} 

export default new UserService();
