export function loginRedirect(error) {

    if ( error?.response?.status === 401) { //error.response.status === 403  || error.response.status === 400 ||
       localStorage.clear();
       window.location.replace('#/login?loggedout=true')
    }

}