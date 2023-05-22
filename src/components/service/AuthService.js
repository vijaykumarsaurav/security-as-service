class AuthService {

    getLoggedInUserInfo() {
        localStorage.getItem("UserInfo");
    }

    getAuthHeader(base64String){
        return { 'headers': {'Authorization': base64String}, 'withCredentials': true}
    }

    getRequestedCookie(){
        return {  'withCredentials': true }
    }

    // logout() {

    //     if(window.localStorage.getItem("token")){
    //       localStorage.clear();
    //       this.props.history.push("/login");
    //     }
    //     console.log("logout");
    // }
}

export default new AuthService();