import React from 'react';
import "@carbon/charts/styles.css";
import UserService from '../service/UserService'
import { Button, Select, SelectItem, Checkbox, DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction, TableSelectAll, TableSelectRow, Pagination } from '@carbon/react';
import 'carbon-components/scss/globals/scss/styles.scss';
import { Download, OrderDetails, Filter, Add } from '@carbon/react/icons';
import { CSVLink, CSVDownload } from "react-csv";

import './carbonStyle.scss';
import { loginRedirect } from "../utils/AuthErrorHandler";
import moment from 'moment';
//import DashboardDialog from './DashboardDialog';
import queryString from "query-string"
import HeaderNavbar from '../HeaderNavbar';
import { ModalWrapper } from '@carbon/react';
import DownloadCSV from './DownloadCSV';
import CreateUpdateException from './CreateUpdateException';

const ExceptionModal = ({currentRow, title, isSelectedPolicy, dataLoader, actionType, selectedPolicy }) => (

	<ModalWrapper
		buttonTriggerText={title === "Edit Calibration" || title === 'Edit Exclusions' ? "Edit" : title}
		modalHeading={title}
		size='md'
		disabled={isSelectedPolicy}
		//  modalLabel="test"
		passiveModal={true}
	//handleSubmit={()=> alert(1)}
	>
		<CreateUpdateException currentRow={currentRow} dataLoader={dataLoader} actionType={actionType} selectedPolicy={selectedPolicy} />
	</ModalWrapper>

);

export default function Dashboard() {

	const [rows, setRows] = React.useState([]);
	const [rowsUnassignedScan, setRowsUnassignedScan] = React.useState([]);
	const [hccycleName, setHccycleName] = React.useState('');
	const [policies, setPolicies] = React.useState([]);
	const [policyName, setPolicyName] = React.useState('');
	const [calibrationRows, setCalibrationRows] = React.useState([]);
	const [suppresstionRows, setsuppresstionRows] = React.useState([]);
	const [falsePositiveRows, setFalsePositiveRows] = React.useState([]);

	// const [scanDate, setScanDate] = React.useState('');
	// const [loader, setLoader] = React.useState(false);
	// const [loaderScan, setLoaderScan] = React.useState(false);

	// const [reloadHCcycle, setReloadHCcycle] = React.useState(false);
	// const [reloadScanApi, setReloadScanApi] = React.useState(false);

	// const [selectionModel, setSelectionModel] = React.useState([]);
	const [downloadReportFlag, setDownloadReportFlag] = React.useState(false);



	// 	const [rows, setRows] = React.useState([]);
	//   const [rowsUnassignedScan, setRowsUnassignedScan] = React.useState([]);
	//   const [hccycleName, setHccycleName] = React.useState('');
	//   const [policies, setPolicies] = React.useState([]);
	//   const [policyName, setPolicyName] = React.useState('');
	//   const [hcrows, setHcrows] = React.useState([]);
	//   const [suppresstionRows, setsuppresstionRows] = React.useState([]);
	const [policyRows, setPolicyRows] = React.useState([]);
	//   const [policyStatistic, setPolicyStatistic] = React.useState({});


	const [scanDate, setScanDate] = React.useState('');
	const [loader, setLoader] = React.useState(false);
	const [loaderScan, setLoaderScan] = React.useState(false);
	const [dataLoader, setDataLoader] = React.useState(true);

	const [reloadHCcycle, setReloadHCcycle] = React.useState(false);
	const [reloadScanApi, setReloadScanApi] = React.useState(false);

	const [selectionModel, setSelectionModel] = React.useState([]);
	const [selectedPolicy, setSelectedPolicy] = React.useState('');
	const [policyScanData, setPolicyScanData] = React.useState([]);

	let query = queryString.parse(window.location.href)

	React.useEffect(() => {

		setSelectedPolicy(window.localStorage.getItem('selectedPolicy'))
		

	}, []);

	React.useEffect(() => {
		setLoader(true)

		UserService.getCombinePolicyScansData(query?.id, localStorage.getItem('selectedOrg')).then((results) => {
			if (results.status === 200) {
				// setRows(results.data);
				let rowsData = [];
				let policies = [];
				results.data.forEach(element => {
					const checks = element?.checks;
					//  setPolicyRows([...policyRows, element?.policy]) 
					policies.push(element?.policy)

				});

				setPolicyRows([...new Set(policies)])
				setRows(rowsData)
				// console.log("rowsData", rowsData)
				//
				setLoader(false)
			}
		}).catch((error) => {
			console.log("error", error)
			//alert("Fail to connect get HC API " + error);
		});

	}, []);



	React.useEffect(() => {

		setDataLoader(true)
		if (selectedPolicy) {
			UserService.getPolicyScansData(selectedPolicy)
				.then(result => {

					console.log('selectedPolicydatachecks', result.data)
					// if(result.status === 200){
					//   setPolicyRows(result.data)
					// }
					setPolicyScanData(result.data?.checks)
					localStorage.setItem("policyScanData", JSON.stringify(result.data?.checks))
					setDataLoader(false)

				}).catch(error => {
					loginRedirect(error);

				});
		}

	}, [selectedPolicy])


	React.useEffect(() => {
		setLoader(true);

		UserService.getCalibrations(window.localStorage.getItem('selectedPolicy')).then((results) => {
			if (results.status === 200) {
				let hcList = results.data;

				hcList.forEach(element => {
					element.formatedExpirationDate = element.expirationDate ? moment(element.expirationDate).format('DD-MM-YYYY') : ""
					element.ticketType = 'Calibration';

				});

				setCalibrationRows(hcList);
				setLoader(false)
			}
		}).catch((error) => {
			console.log("error", error)
			loginRedirect(error)
		});

	}, [reloadScanApi, reloadHCcycle]);

	React.useEffect(() => {
		setLoaderScan(true)

		let policiesList = [];

		UserService.getSuppressions(window.localStorage.getItem('selectedPolicy')).then((results) => {
			if (results.status === 200) {

				results.data.forEach(element => {
					element.formatedExpirationDate = element.expirationDate ? moment(element.expirationDate).format('DD-MM-YYYY') : ""
					element.ticketType = 'Suppression';
				});

				setsuppresstionRows(results.data);
				setLoaderScan(false)
			}
		}).catch((error) => {
			console.log("error", error)
			loginRedirect(error)
		});

	}, [reloadScanApi, reloadHCcycle]);


	const headerData = [
		{
			header: 'Id',
			key: 'id',
		},
		{
			header: 'Section',
			key: 'section',
		},
		{
			header: 'Priority',
			key: 'priority',
		},
		{
			header: 'Hostname Pattern',
			key: 'pattern',
		},
		{
			header: 'Change Tiket No.',
			key: 'changeTiketNumber',
		},
		{
			header: 'Expiration Date',
			key: 'formatedExpirationDate',
		},
		{
			header: 'Description',
			key: 'description',
		},
		{
			header: 'Policy Parameters',
			key: '',
		},
		{
			header: 'Status',
			key: 'status',
		},
		{
			header: 'Edit',
			key: 'Edit',
		},
		{
			header: 'Delete',
			key: 'Delete',
		}
	];

	const headerDataExclusion = [
		{
			header: 'Id',
			key: 'id',
		},
		{
			header: 'Section',
			key: 'section',
		},
		{
			header: 'Priority',
			key: 'priority',
		},
		{
			header: 'Hostname Pattern',
			key: 'pattern',
		},
		{
			header: 'Violation Pattern',
			key: 'violation',
		},
		{
			header: 'Exclusion Type',
			key: 'type',
		},
		{
			header: 'Change Tiket No.',
			key: 'changeTiketNumber',
		},
		{
			header: 'Expiration Date',
			key: 'formatedExpirationDate',
		},
		{
			header: 'Description',
			key: 'description',
		},
		{
			header: 'Status',
			key: 'status',
		},
		{
			header: 'Edit',
			key: 'Edit',
		},
		{
			header: 'Delete',
			key: 'Delete',
		}
	];


	const downloadReport = () => {
		console.log("downloadReport", rows)
		setDownloadReportFlag(true)
		window.location.reload()
	}
	const handleDelete = (type, id) => {
  
		if(window.confirm(`Are you sure to delete the ${type} ?`))
		UserService.deleteCalibrationSuppression(type, id).then((results) => {
			let data = results.data; 
			if (data.ok) {
				alert(data.message);
				 window.location.reload(true)
			}
		  }).catch((error) => {
			console.log("error", error)
			alert(error);
		  });
	  
		
	  };
	  
	return (
		<div>
			<HeaderNavbar />
			<br /><br /><br /><br />
			<h2> Exceptions </h2>
			{/* .slice(firstRowIndex, firstRowIndex + currentPageSize) */}

			<div >

				<div class="cds--grid">

				{/* <div class="cds--row">
					<div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">4</div>
					<div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">4</div>
					<div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">
					<Select
								defaultValue="placeholder-item"
								//	helperText="Optional helper text"
								id="select-1"
								value={selectedPolicy}
								invalidText="A valid value is required"
								labelText="Select Policy"
								onChange={(e) => {
									console.log('policy elemet ', e.target.value)
									setSelectedPolicy(e.target.value)
									localStorage.setItem('selectedPolicy', e.target.value)
									window.location.reload()
								}}
							>
								<SelectItem
									text="Choose a Policy"
									value=""
								/>
								{policyRows?.map((policy) => {
									return (

										<SelectItem text={policy} value={policy} />

									)
								})}
							</Select>
								
					</div>
					<div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">
					<ExceptionModal isSelectedPolicy={!selectedPolicy ? true : false} title={'Create Calibration'} dataLoader={dataLoader} actionType={"Create"} policyScanData={policyScanData} selectedPolicy={selectedPolicy} />

					</div>
				</div> */}
					<div class="cds--row">
						
					    <div class="cds--col">

						</div>
						<div class="cds--col">

						</div>
						<div class="cds--col">

						</div>
						<div class="cds--col">

						</div>
					
						<div class="cds--col" >
							<Select
								defaultValue="placeholder-item"
								//	helperText="Optional helper text"
								id="select-1"
								value={selectedPolicy}
								invalidText="A valid value is required"
								labelText="Select Policy"
								onChange={(e) => {
									console.log('policy elemet ', e.target.value)
									setSelectedPolicy(e.target.value)
									localStorage.setItem('selectedPolicy', e.target.value)
									window.location.reload()
								}}
							>
								<SelectItem
									text="Choose a Policy"
									value=""
								/>
								{policyRows?.map((policy) => {
									return (

										<SelectItem text={policy} value={policy} />

									)
								})}
							</Select>
						</div>
						<div class="cds--col">
							<br />
							<ExceptionModal isSelectedPolicy={!selectedPolicy ? true : false} title={'Create Exception'} actionType={"Create"} policyScanData={policyScanData} selectedPolicy={selectedPolicy} />

						</div>
					</div>
				</div>

			</div>

			<DataTable rows={calibrationRows} headers={headerData} isSortable >
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
					<TableContainer title={`Calibrations`}>


						<TableToolbar>

							<TableToolbarContent>
								<TableToolbarSearch
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onChange={onInputChange}
								/>

								<TableToolbarMenu
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
								>
									<DownloadCSV setDownloadReportFlag={setDownloadReportFlag} downloadReportFlag={downloadReportFlag} data={rows} />

									{/* <TableToolbarAction onClick={() => alert('Alert 2')}>
										Action 2
									</TableToolbarAction>
									<TableToolbarAction onClick={() => alert('Alert 3')}>
										Action 3
									</TableToolbarAction> */}

								</TableToolbarMenu>



							</TableToolbarContent>
							{/* <ExceptionModal isSelectedPolicy={!selectedPolicy ? true : false} title={'Create Calibration'} dataLoader={dataLoader} actionType={"Create"} policyScanData={policyScanData} selectedPolicy={selectedPolicy} /> */}
						</TableToolbar>
						<Table useZebraStyles={false} style={{ whiteSpace: 'nowrap' }}>
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

											// <TableCell title={cell.value} key={cell.id}>{cell.value?.length >= 30 ? cell.value?.substr(0, 30)+ "..." : cell.value} </TableCell>
											<TableCell title={cell.value} key={cell.id} >{cell.info.header === 'Edit' ? <ExceptionModal currentRow={calibrationRows.filter(item => item.id === row.id)[0]} isSelectedPolicy={!selectedPolicy ? true : false} title={'Edit Calibration'}  actionType={"Edit"} policyScanData={policyScanData} selectedPolicy={selectedPolicy} /> : cell.info.header === 'Delete' ? <Button onClick={() => handleDelete('calibration', row.id)}  size='md' kind='tertiary' >{cell.info.header}</Button> : cell.value?.length >= 30 ? cell.value?.substr(0, 30) + "..." : cell.value}</TableCell>

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

			<br />
			<DataTable rows={suppresstionRows} headers={headerDataExclusion} isSortable >
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
					<TableContainer title={`Exclusions`}>
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
								<TableToolbarSearch
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onChange={onInputChange}
								/>

								<TableToolbarMenu
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
								>
									<TableBatchAction
										tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
										renderIcon={Download}
										onClick={() => downloadReport()}
									>
										Download
										{downloadReportFlag ? <CSVDownload enclosingCharacter={`"`} separator={','} filename='Report.csv' data={rows} target="_blank" /> : ""}

									</TableBatchAction>
									{/* <TableToolbarAction onClick={() => alert('Alert 2')}>
										Action 2
									</TableToolbarAction>
									<TableToolbarAction onClick={() => alert('Alert 3')}>
										Action 3
									</TableToolbarAction> */}

								</TableToolbarMenu>

							</TableToolbarContent>
							{/* <ExceptionModal isSelectedPolicy={!selectedPolicy ? true : false} title={'Create Exclusion'} dataLoader={dataLoader} actionType={"Create"} policyScanData={policyScanData} selectedPolicy={selectedPolicy} /> */}

						</TableToolbar>
						<Table useZebraStyles={false} style={{ whiteSpace: 'nowrap' }}>
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
											<TableCell title={cell.value} key={cell.id} >{cell.info.header === 'Edit' ? <ExceptionModal currentRow={suppresstionRows.filter(item => item.id === row.id)[0]} isSelectedPolicy={!selectedPolicy ? true : false} title={'Edit Exclusions'}  actionType={"Edit"} policyScanData={policyScanData} selectedPolicy={selectedPolicy} /> : cell.info.header === 'Delete' ? <Button onClick={() => handleDelete('Exclusion', row.id)}  size='md' kind='tertiary' >{cell.info.header}</Button> : cell.value?.length >= 30 ? cell.value?.substr(0, 30) + "..." : cell.value}</TableCell>

											// <TableCell title={cell.value} key={cell.id} >{cell.info.header === 'Edit' || cell.info.header === 'Delete' ? <Button onClick={() => handleDelete('Exclusion', row.id)}  size='sm' kind='tertiary' >{cell.info.header}</Button> : cell.value?.length >= 30 ? cell.value?.substr(0, 30) + "..." : cell.value}</TableCell>

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