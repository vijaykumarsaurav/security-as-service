import React from 'react';
import "@carbon/charts/styles.css";
import UserService from '../service/UserService'
import { Button, Checkbox, DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction, TableSelectAll, TableSelectRow, Pagination } from '@carbon/react';
import 'carbon-components/scss/globals/scss/styles.scss';
import { Download, OrderDetails } from '@carbon/react/icons';
import './carbonStyle.scss'; 
import { loginRedirect } from "../utils/AuthErrorHandler";
import moment from 'moment';

import HeaderNavbar from '../HeaderNavbar';
import DownloadCSV from './DownloadCSV';

export default function Dashboard() {

	const [rowData, setRowData] = React.useState([]);
	const [downloadReportFlag, setDownloadReportFlag] = React.useState(false);

	// React.useEffect(()=> {
	//   setSelectedOrg(localStorage.getItem('selectedOrg'))
	//   setSelectedAvalablePolicy(window.localStorage.getItem('selectedAvalablePolicy'))
	// }, [])

	React.useEffect(() => {
		let orgName = localStorage.getItem('selectedOrg')
		if (orgName) {
			UserService.getScannedDates(orgName).then((results) => {
				if (results.status === 200) {
					results.data.forEach(scan => {
						console.log("console", scan)
						let allPoliciesList = [];
						scan.policies.forEach(element => {
							allPoliciesList.push(element?.name)
						});
						let uniquePolics = [...new Set(allPoliciesList)];

						scan.policies = uniquePolics.join();
						scan.checks = scan.statistic?.checks;
						scan.hostnames = scan.statistic?.hostnames;
						scan.violations = scan.statistic?.violations;
						scan.scanDate = moment(scan.scanDate).format('DD-MM-YYYY');

						// scan.policies =  [...new Set(getPolicies(scan))];
					});

					setRowData(results.data);
				}
			}).catch((error) => {
				console.log("error", error)
				loginRedirect(error);
				//alert("Error" + error);
				//alert("Fail to connect get Scan Dates API " + error);
			});
		}
	}, []);

	const headerData = [
		{
			header: 'Job Id',
			key: 'jobId',
		},
		{
			header: 'Ansible Job',
			key: 'name',
		},
		{
			header: 'Policies',
			key: 'policies',
		},
		{
			header: 'Scan Date',
			key: 'scanDate',
		},
		{
			header: 'Hostnames',
			key: 'hostnames',
		},
		{
			header: 'Results',
			key: 'checks',
		},
		{
			header: 'Violations',
			key: 'violations',
			cell: (record) => {
				return (

					<button
						className="btn btn-primary btn-sm"

					>
						Edit
					</button>

				);
			},
		}
	];

	const hitTheAction = (row, header ) => {

		console.log('idddd', header)
		window.open('#/dashboard-details?q=q&policyName=' + '' + "&id="+ row.id + "&viewType=" + header, "_blank");

	   // window.location.replace('#/scans-exceptions?q=q&policyName=' + '' + "&id="+ row.id )

	}


	document.title = "Carbon Data Table"

	return (
		<div>

			<HeaderNavbar  />
			<br /><br />
			<DataTable rows={rowData} headers={headerData} isSortable >
				{({
					rows,
					headers,
					getHeaderProps,
					getRowProps,
					getSelectionProps,
					getBatchActionProps,
					onInputChange,
					selectedRows,
				}) => (
					<TableContainer title="Available Scans">
						<TableToolbar>
							<TableBatchActions {...getBatchActionProps()}>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={Download}
									onClick={() =>window.open('#/dashboard-combind-report?q=q&policyName=' + '' + "&id="+ selectedRows.map(item => item.id), "_blank")}
								>
									Report Details
								</TableBatchAction>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={OrderDetails}
									onClick={() =>window.location.replace('#/exceptions?q=q&policyName=' + '' + "&id="+ selectedRows.map(item => item.id))}
								>
									Exceptions
								</TableBatchAction>
								{/* <TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={Download}
									onClick={() => console.log('download clicked')}
								>
									Download
								</TableBatchAction> */}
							</TableBatchActions>
							<TableToolbarContent>
								<TableToolbarSearch
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onChange={onInputChange}
								/>
								<TableToolbarMenu
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
								>
									<TableToolbarAction primaryFocus onClick={() => alert('Alert 1')}>
										Action 1
									</TableToolbarAction>
									<TableToolbarAction onClick={() => alert('Alert 2')}>
										Action 2
									</TableToolbarAction>
								
								</TableToolbarMenu>
								<DownloadCSV setDownloadReportFlag={setDownloadReportFlag} downloadReportFlag={downloadReportFlag} data={rowData}  />
							</TableToolbarContent>
						</TableToolbar>
						<Table useZebraStyles={false} >
							<TableHead>
								<TableRow>
									<TableSelectAll {...getSelectionProps()} />
									{headers.map((header) => (
										<TableHeader {...getHeaderProps({ header })}>
											{header.header}
										</TableHeader>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow {...getRowProps({ row })}>
										<TableSelectRow {...getSelectionProps({ row })} />
										{row.cells.map((cell) => (

											<TableCell key={cell.id} >{cell.info.header === 'hostnames' || cell.info.header === 'checks' || cell.info.header === 'violations' ? <Button onClick={() => hitTheAction(row, cell?.info?.header)} size='sm' kind='tertiary' >{cell.value}</Button> : cell.value}</TableCell>

										))}
									</TableRow>
								))}
							</TableBody>
						</Table>

						{/* <Pagination
							backwardText="Previous page"
							forwardText="Next page"
							itemsPerPageText="Items per page:"
							page={1}
							pageNumberText="Page Number"
							pageSize={10}
							pageSizes={[
								10,
								20,
								30,
								40,
								50
							]}
							totalItems={rows.length}
							disabled={false} isLastPage={false} pagesUnknown={false} /> */}
					</TableContainer>
				)}
			</DataTable>


		</div>

	);
}