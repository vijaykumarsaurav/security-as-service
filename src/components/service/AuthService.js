class AuthService {

    getLoggedInUserInfo() {
        localStorage.getItem("UserInfo");
    }

    getHeader() {
        return { 'headers': {'RequestToken': localStorage.getItem("requestToken") } }
        //return { 'headers': { 'X-Server-Key': '8786gfhy' } }
    }

    getImageHeader() {
        return { 'headers': {'token': localStorage.getItem("token")}}
        //return { 'headers': { 'X-Server-Key': '8786gfhy' } }
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