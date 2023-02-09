import { HashRouter as Router, Route, Switch} from 'react-router-dom'
import React from "react";
import ScannedReports from './reports/ScannedReports';
import ScannedReportsDuplicates from './reports/ScannedReportsDuplicates';
import ScannedReportsDataGrid from './reports/ScannedReportsDataGrid';
import DashboardHcDetailsView from './reports/DashboardHcDetailsView';
import DashboardUnscannedDetailsView from './reports/DashboardUnscannedDetailsView';
import LoginComponent from './login/LoginComponent';

import Dashboard from './reports/Dashboard';
import Exceptions from './reports/Exceptions';

import ChangeRequestDataGrid from './reports/ChangeRequestDataGrid';
import ChangeRequestDataGridSeperateTable from './reports/ChangeRequestDataGridSeperateTable';


const AppRouter = () => {

    return(
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/" exact component={ScannedReportsDataGrid}/>
                    <Route path="/login" exact component={LoginComponent}/>
                    <Route path="/scanned-reports" component={ScannedReports}/>
                    <Route path="/scanned-reports-duplicate" component={ScannedReportsDuplicates}/>
                    <Route path="/scanned-reports-datagrid" component={ScannedReportsDataGrid}/>
                    <Route path="/hc-details-view" component={DashboardHcDetailsView}/>
                    <Route path="/unscanned-details-view" component={DashboardUnscannedDetailsView}/>

                    
                    

                    <Route path="/exceptions" component={Exceptions}/>

                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/change-request" component={ChangeRequestDataGrid}/>
                    <Route path="/change-request-seperate-table" component={ChangeRequestDataGridSeperateTable}/>

                    <Route path="*" component={ScannedReportsDataGrid} />
                     
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default AppRouter;