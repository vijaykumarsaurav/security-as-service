import { HashRouter as Router, Route, Switch} from 'react-router-dom'
import React from "react";
import LoginComponent from './login/LoginComponent';
import DataTable from './reports/DataTable';

import Dashboard from './reports/Dashboard';
import DashboardDetails from './reports/DashboardDetails';
import DashboardCombindReport from './reports/DashboardCombindReport';
import Exceptions from './reports/Exceptions';


const AppRouter = () => {

    return(
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/" exact component={Dashboard}/>
                    <Route path="/login" exact component={LoginComponent}/>
                    <Route path="/datatable" exact component={DataTable}/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/dashboard-details" component={DashboardDetails}/>
                    <Route path="/dashboard-combind-report" component={DashboardCombindReport}/>
                    <Route path="/exceptions" component={Exceptions}/>

                    <Route path="*" component={Dashboard} />
                     
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default AppRouter;