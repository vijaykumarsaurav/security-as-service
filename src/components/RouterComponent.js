import { HashRouter as Router, Route, Switch} from 'react-router-dom'
import React from "react";
import LoginComponent from './login/LoginComponent';
import Histograms from './reports/Histograms';

import Dashboard from './reports/Dashboard';


const AppRouter = () => {

    return(
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/" exact component={Dashboard}/>
                    <Route path="/login" exact component={LoginComponent}/>
                    <Route path="/histogram" exact component={Histograms}/>
                    <Route path="/dashboard" component={Dashboard}/>
             
                    <Route path="*" component={Dashboard} />
                     
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default AppRouter;