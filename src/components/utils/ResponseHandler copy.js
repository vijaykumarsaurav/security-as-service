import Notify from "./Notify";

export function resolveResponse(response) {
   
    let data = {};

    console.log('resolveResponse', response)
    

    if(response.status === 400 || response.status === 401 || response.status === 403) {
        localStorage.clear();
        //return window.location.replace("/#/login");
        return Promise.reject(window.location.replace("#/login"));
    }else {
        Notify.showError(data.message);
        return Promise.reject(data.message);
    }
  
}