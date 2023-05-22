import React from 'react';
import "@carbon/charts/styles.css";
import UserService from '../service/UserService'
import { Button, Checkbox, DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction, TableSelectAll, TableSelectRow, Pagination } from '@carbon/react';
import 'carbon-components/scss/globals/scss/styles.scss';
import { Download, OrderDetails, Filter } from '@carbon/react/icons';
import { CSVLink, CSVDownload } from "react-csv";

import './carbonStyle.scss';
import { loginRedirect } from "../utils/AuthErrorHandler";
import moment from 'moment';
//import DashboardDialog from './DashboardDialog';
import queryString from "query-string"
import HeaderNavbar from '../HeaderNavbar';
import DownloadCSV from './DownloadCSV';

import ColumnFilter from './ColumnFilter';


export default function Dashboard() {

	const [rowData, setRowData] = React.useState([]);
	const [allRowData, setAllRowData] = React.useState([]);
	const [applyFilter, setApplyFilter] = React.useState([]);

	const [firstRowIndex, setFirstRowIndex] = React.useState(0);
	const [currentPageSize, setCurrentPageSize] = React.useState(10);
  
	const [rows, setRows] = React.useState([]);
	const [loader, setLoader] = React.useState(false);
  
	const [urlHCcycle, setUrlHCcycle] = React.useState(decodeURIComponent(window.location.href.split('?')[1]?.split('=')[1])?.split("&")[0]);
	const [urlFilterProps, setUrlFilterProps] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[1]?.split('=')[1]));
	const [urlVoilations, setUrlVoilations] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[2]?.split('=')[1]));
	const [changeId, setChangeId] = React.useState(decodeURIComponent(window.location.href?.split('?')[1]?.split('&')[3]?.split('=')[1]));
  
	const [selectionModel, setSelectionModel] = React.useState( [] );
    let query =  queryString.parse(window.location.href)
	const [downloadReportFlag, setDownloadReportFlag] = React.useState(false);

   
	// React.useEffect(()=> {
	//   setSelectedOrg(localStorage.getItem('selectedOrg'))
	//   setSelectedAvalablePolicy(window.localStorage.getItem('selectedAvalablePolicy'))
	// }, [])

	React.useEffect(() => {
		setLoader(true)
	
		UserService.getScanDetails(query?.id).then((results) => {
		  if (results.status === 200) {
		   // setRows(results.data);
		   let rows = []; 
		   results.data.forEach(element => {
			const checks = element?.checks;
			const policyName = element.policy;
  
			if(query?.viewType === 'violations' || query?.viewType === 'checks'){
				let violationsData = duplicateDeviationsData(checks, policyName);
				console.log("violationsData", violationsData.length)
	  
				violationsData.forEach((element, i)=> {
					rows.push(element);
				});
			 }

			if(query?.viewType === 'checks'){
				let tempChecksData = getResults(checks, policyName);
				tempChecksData.forEach((element, i) => {
					rows.push(element);
				});
				console.log("tempDevDataResult", tempChecksData.length)

			 }

		 });
			setRowData(rows)
			setAllRowData(rows)
		    console.log("rows", rows)
			//
			setLoader(false)
		  }
		}).catch((error) => {
		  console.log("error", error)
		  loginRedirect(error);
		 // alert("Fail to connect get HC API " + error);
		});
	
		// if(urlVoilations != 'undefined' ){
		//   setSelectionModel(JSON.parse(urlVoilations)); 
		// }
	
	  }, []);

	
	  React.useEffect(()=> {
		setRowData(applyFilter)
	  },[applyFilter])
	const headerData = [
		{
			header: 'Check Section',
			key: 'check_section',
		},
		{
			header: 'Policy',
			key: 'displayPolicyName',
		},
		{
			header: 'Severity',
			key: 'severity',
		},
		{
			header: 'Check Description',
			key: 'check_description',
		},
		{
			header: 'Hostname',
			key: 'hostname',
		},
		{
			header: 'Check status',
			key: 'check_status',
		},
		{
			header: 'IP address',
			key: 'ip',
		},
		{
			header: 'Scan Date',
			key: 'scan_date',
		},
		{
			header: 'Violation',
			key: 'violation_name',
		},
		{
			header: 'Measure Values',
			key: 'measure_values',
		},
		{
			header: 'Policy Parameters',
			key: 'policy_parameters',
		}
	];

	const duplicateDeviationsData = (checks, policy='') => {
		let tempVoilationData = []; 
		let count =0 
		for (let index = 0; index < checks.length; index++) {
		  const element = checks[index];
		  element?.hosts.forEach(host => {
			if (host.check_status === 'KO') {
			  host.violations.forEach(violation => {
				count++
				let policyName = policy.split('-'); 
				let hostData = {
				  id: violation.id, 
				  check_section: element.check_section,
				  displayPolicyName : `${policyName[0]} ${policyName[1]} v${policyName[3]}`,
				  severity: element.severity,
				  check_description: element.check_description,
				  hostname: host.hostname,
				  check_status: host.check_status,
				  ip: host.ip,
				  scan_date: moment(host.scan_date).format('DD-MM-YYYY'),
				  violation_name : violation.message,
				  measure_values: host.measure_values ? host.measure_values?.join() : "", 
				  policy_parameters: host.policy_parameters ? host.policy_parameters?.join() : "",
				  scan_type: host?.scan_type?.length > 0 ? host?.scan_type?.join(): "",
				  any_suppression : violation?.suppression || host?.calibartion
				}
				tempVoilationData.push(hostData);
			  })
			}
			
		  });
		 console.log("voilationcount", count, tempVoilationData.length)
	  
	  
		}
	   return tempVoilationData;
	  };
	  
	  const getResults = (checks, policy='') => {
		let tempResultData = [];
		let id = 0;
		for (let index = 0; index < checks.length; index++) {
		  const element = checks[index];
		  element?.hosts.forEach(host => {
			let policyName = policy.split('-'); 
			let hostData = {
			  id: id,
			  check_section: element.check_section,
			  displayPolicyName : `${policyName[0]} ${policyName[1]} v${policyName[3]}`,
			  severity: element.severity,
			  check_description: element.check_description,
			  hostname: host.hostname,
			  check_status: host.check_status,
			  ip: host.ip,
			  scan_date: moment(host.scan_date).format('DD-MM-YYYY'),
			  violation_name : "",
			  measure_values: host.measure_values ? host.measure_values?.join() : "", 
			  policy_parameters: host.policy_parameters ? host.policy_parameters?.join() : "",
			  scan_type : host?.scan_type?.length > 0 ? host?.scan_type?.join(): "",
			  any_suppression : ''
			}
	  
			if (host.check_status === 'OK') {
			  tempResultData.push(hostData);
			  id++;
			} 
		  });
		}
	   return tempResultData;
	  };
	  

	const pageChange = (e) => {
		console.log(e.target)
	}

	
	const filterByColumn = (filterKey,operatorName, filterValue) => {
		console.log(filterKey,operatorName, filterValue, allRowData)
		let searchResults =[]; 

		if(filterKey && operatorName && filterValue){
			if(operatorName === 'equals'){
				searchResults = allRowData.filter(item => item[filterKey]?.toLowerCase() == filterValue?.toLowerCase())
				console.log('equals filter', searchResults)
				setApplyFilter(searchResults)
			//	setRowData(searchResults)
			}
			if(operatorName === 'startswith'){
				searchResults = allRowData.filter(item => item[filterKey]?.toLowerCase()?.startsWith(filterValue?.toLowerCase()))
				console.log('start with filter', searchResults)
			//	setRowData(searchResults)
			    setApplyFilter(searchResults)
			}
			
		}

		// if(!filterKey && !operatorName && !filterValue){
		// 	setRowData(allRowData)
		// }
		if(!filterValue){
			console.log('filterValue', filterValue, !filterValue)
			setRowData(allRowData)
		}

	}
	console.log('rowDatarowData', rowData)


	return (
		<div>
			<HeaderNavbar />
			<br /><br />
			{/* .slice(firstRowIndex, firstRowIndex + currentPageSize) */}
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
					<TableContainer title={`${query?.viewType === "checks" ? "Checks" : "Violations"} (${rows.length})`}>
							<ColumnFilter filterByColumn={filterByColumn} headerData={headerData}/>
						<TableToolbar>
							<TableBatchActions {...getBatchActionProps()}>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={Download}
									onClick={() => console.log('delete clicked')}
								>
									Report Details
								</TableBatchAction>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={OrderDetails}
									onClick={() => console.log('save clicked')}
								>
									Exceptions
								</TableBatchAction>
						
							</TableBatchActions>
							<TableToolbarContent>
								{/* <TableToolbarSearch
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onChange={onInputChange}
								/> */}

							
								

								<TableToolbarMenu
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
								>
									<TableToolbarAction primaryFocus renderIcon={Filter}  onClick={() => alert('Alert 1')}>
										Filter
									</TableToolbarAction>
									{/* <TableToolbarAction onClick={() => alert('Alert 2')}>
										Action 2
									</TableToolbarAction>
									<TableToolbarAction onClick={() => alert('Alert 3')}>
										Action 3
									</TableToolbarAction> */}
									
								</TableToolbarMenu>
								{/* <Button
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onClick={() => downloadReport()}
									size="small"
									kind="primary"
									renderIcon={Download}
								>
									Download 
								</Button> */}
								<DownloadCSV setDownloadReportFlag={setDownloadReportFlag} downloadReportFlag={downloadReportFlag} data={rowData} />  

							</TableToolbarContent>
						</TableToolbar>
						<Table useZebraStyles={false}  style={{whiteSpace: 'nowrap'}}>
							<TableHead>
								<TableRow>
									{/* <TableSelectAll {...getSelectionProps()} /> */}
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
										{/* <TableSelectRow {...getSelectionProps({ row })} /> */}
										{row.cells.map((cell) => (

											<TableCell title={cell.value} key={cell.id}>{cell.value.length >= 30 ? cell.value?.substr(0, 30)+ "..." : cell.value} </TableCell>

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