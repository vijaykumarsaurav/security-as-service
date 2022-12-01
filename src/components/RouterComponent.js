import { HashRouter as Router, Route, Switch} from 'react-router-dom'
import React from "react";
import ScannedReports from './reports/ScannedReports';
import ScannedReportsDuplicates from './reports/ScannedReportsDuplicates';
import ScannedReportsDataGrid from './reports/ScannedReportsDataGrid';
import DashboardDetailsView from './reports/DashboardDetailsView';

import Dashboard from './reports/Dashboard';
import ChangeRequestDataGrid from './reports/ChangeRequestDataGrid';


const AppRouter = () => {

    return(
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/" exact component={ScannedReportsDataGrid}/>
                    <Route path="/scanned-reports" component={ScannedReports}/>
                    <Route path="/scanned-reports-duplicate" component={ScannedReportsDuplicates}/>
                    <Route path="/scanned-reports-datagrid" component={ScannedReportsDataGrid}/>
                    <Route path="/dashboard-details-view" component={DashboardDetailsView}/>

                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/change-request" component={ChangeRequestDataGrid}/>

                    <Route path="*" component={ScannedReportsDataGrid} />
                     
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default AppRouter;