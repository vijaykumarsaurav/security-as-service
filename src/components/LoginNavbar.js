import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AirtellLogo from './airtellogo.png';
import  {IMAGE_VALIDATION_TOKEN} from "../utils/config";

const style = {
    flexGrow: 1,
    fontSize: '17px', 
    marginTop: '6px'
}


const LoginNavBar = (props) => {
    
    return (
        <React.Fragment>
            {/* <AppBar position="static" style={{backgroundColor: '#f44336'}}/> */}
            <AppBar position="static">
                <Toolbar>
                <img  style={{width:"110px"}} src={AirtellLogo} />

                    <div>
                        <Typography variant="h6" style={style}>
                          &nbsp; Airtel DIY Activation
                        </Typography>
                    </div>              
                    
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
};

export default LoginNavBar;