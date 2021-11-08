import React from 'react';
import UserService from "../service/UserService";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { Link } from "react-router-dom";

class LogoutComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.logout = this.logout.bind(this);

    }

    render() {

        return(
            <React.Fragment>

                    <Link style={{textDecoration: "none"}}>
                        <ListItem button component='a' onClick={this.logout}>
                            <ListItemIcon>
                                <PowerSettingsNewIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </Link>
                    
            </React.Fragment>
        )

    }

    componentDidMount() {
   

    }

    deleteAllCookies = () => {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    logout = (e) => {
        
        UserService.logout()
        .then(res => {

         localStorage.clear();
         this.deleteAllCookies();
         window.location.replace("#/");
         return;
        });
    }
}

const styles ={
    label: {
        display: 'flex',
        justifyContent: 'center'
    }
}

export default LogoutComponent;