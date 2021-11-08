import { HashRouter as Router, Route, Switch , Redirect} from 'react-router-dom'
import React from "react";
import LoginComponent from "./login/LoginComponent";

// import UserSubmitDetails from './KYC_ReRegistration/UserSubmitDetails';
import PrepaidPortal from './DiyPrepaidPortal/PrepaidPortal';

import Homepage from './Homepage';

import CheckDiyStatus from './login/CheckDiyStatus';


const AppRouter = () => {

    return(
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/" exact component={Homepage}/>
                    <Route path="/login" component={LoginComponent}/>
                    <Route path="/welcome" component={AdminWelcome} />
                    {/* <Route path="/user-re-registration-old" component={UserSubmitDetails} /> */}
                    <Route path="/user-re-registration" component={PrepaidPortal} />
                    <Route path="/status" component={CheckDiyStatus} />

                    
                    <Route path="*" component={LoginComponent} />
                    {/* <Route render={() => <Redirect to={{pathname: "/"}} />} /> */}
                    
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default AppRouter;