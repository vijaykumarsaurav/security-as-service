import React from 'react';
import ReactDOM from "react-dom";
import { HistogramChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
import UserService from '../service/UserService'
import { Button, Checkbox, DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbar, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableToolbarMenu, TableToolbarAction, TableSelectAll, TableSelectRow, Pagination} from '@carbon/react';
import 'carbon-components/scss/globals/scss/styles.scss';
import { Add, TrashCan, Save, Download } from '@carbon/react/icons';
import './carbonStyle.scss';

function MyComponent() {
	return <Button>Simple Button usage</Button>;
}
export default function Histograms() {
	const data1 = [
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0002",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0002",
			"NO_of_exposures": 2
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 1
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 4
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0002",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 4
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 4
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 4
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2023-0001",
			"NO_of_exposures": 4
		},
		{
			"group": "CVE-2022-41128",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2021-44228",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2022-41128",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2021-44228",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2009-3129",
			"NO_of_exposures": 2
		},
		{
			"group": "CVE-2022-41128",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-0003",
			"NO_of_exposures": 1
		},
		{
			"group": "CVE-2023-21773",
			"NO_of_exposures": 5
		},
		{
			"group": "CVE-2009-3129",
			"NO_of_exposures": 3
		},
		{
			"group": "CVE-2023-21773",
			"NO_of_exposures": 6
		},
		{
			"group": "CVE-2009-3129",
			"NO_of_exposures": 7
		}
	]

	const [cveGroups, setCveGroups] = React.useState([]);

	const [data, setData] = React.useState(data1);
	let cveGroupsData = [];

	React.useEffect(() => {
		UserService.getCveGroups().then((results) => {
			if (results.status === 200) {
				let cveGroups1 = results.data;
				let keys = Object.keys(cveGroups1);
				let temp = [];
				keys?.forEach(key => {
					let value = cveGroups1[key];
					temp.push({ "group": key, "NO_of_exposures": value })
				});
				console.log("data", temp)
				setData(temp)
			}
		}).catch((error) => {
			console.log("error", error)
			//alert("Fail to connect get  API " + error);
		});
	}, []);

	const options = {
		"title": "CVEs and APT groups",
		"axes": {
			"bottom": {
				"title": "APT groups",
				"mapsTo": "NO_of_exposures",
				"bins": 10,
				"limitDomainToBins": true
			},
			"left": {
				"title": "NO_of_exposures",
				"scaleType": "linear",
				"stacked": true,
				"binned": true
			}
		},
		"height": "400px"
	}

	const headerData = [
		{
		  header: 'Name',
		  key: 'name',
		},
		{
		  header: 'Protocol',
		  key: 'protocol',
		},
		{
		  header: 'Port',
		  key: 'port',
		},
		{
		  header: 'Rule',
		  key: 'rule',
		},
		{
		  header: 'Attached Groups',
		  key: 'attached_groups',
		},
		{
		  header: 'Status',
		  key: 'status',
		},
	  ];
	  
	  const rowData = [
		{
		  attached_groups: 'Kevins VM Groups',
		  id: 'a',
		  name: 'Load Balancer 3 Load Balancer 3 Load Balancer 3 Load Balancer 3 Load Balancer 3 Load Balancer 3 Load Balancer 3 Load Balancer 3 ',
		  port: 3000,
		  protocol: 'HTTP',
		  rule: 'Round robin',
		  status: 'Disabled',
		},
		{
		  attached_groups: 'Maureens VM Groups robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancerrobin Load Balancer 3 Load Balancerrobin Load Balancer 3 Load Balancer',
		  id: 'b',
		  name: 'Load Balancer 1',
		  port: 443,
		  protocol: 'HTTP',
		  rule: 'Round robin Load Balancer 3 Load Balancer 3 ',
		  status: 'Starting',
		},
		{
		  attached_groups: 'Andrews VM Groups',
		  id: 'c',
		  name: 'Load Balancer 2',
		  port: 80,
		  protocol: 'HTTP',
		  rule: 'DNS delegation',
		  status: 'Active',
		},
		{
		  attached_groups: 'Marcs VM Groups',
		  id: 'd',
		  name: 'Load Balancer 6',
		  port: 3000,
		  protocol: 'HTTP',
		  rule: 'Round robin',
		  status: 'Disabled',
		},
		{
		  attached_groups: 'Mels VM Groups',
		  id: 'e',
		  name: 'Load Balancer 4',
		  port: 443,
		  protocol: 'HTTP',
		  rule: 'Round robin',
		  status: 'Starting',
		},
		{
		  attached_groups: 'Ronjas VM Groups',
		  id: 'f',
		  name: 'Load Balancer 5',
		  port: 80,
		  protocol: 'HTTP',
		  rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
		  status: 'Active',
		},
		{
			attached_groups: 'Ronjas VM Groups',
			id: 'g',
			name: 'Load Balancer 5',
			port: 80,
			protocol: 'HTTP',
			rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
			status: 'Active',
		  },
		//   {
		// 	attached_groups: 'Ronjas VM Groups',
		// 	id: 'h',
		// 	name: 'Load Balancer 5',
		// 	port: 80,
		// 	protocol: 'HTTP',
		// 	rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
		// 	status: 'Active',
		//   },
		//   {
		// 	attached_groups: 'Ronjas VM Groups',
		// 	id: 'i',
		// 	name: 'Load Balancer 5',
		// 	port: 80,
		// 	protocol: 'HTTP',
		// 	rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
		// 	status: 'Active',
		//   },
		//   {
		// 	attached_groups: 'Ronjas VM Groups',
		// 	id: 'j',
		// 	name: 'Load Balancer 5',
		// 	port: 80,
		// 	protocol: 'HTTP',
		// 	rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
		// 	status: 'Active',
		//   },
		//   {
		// 	attached_groups: 'Ronjas VM Groups',
		// 	id: 'k',
		// 	name: 'Load Balancer 5',
		// 	port: 80,
		// 	protocol: 'HTTP',
		// 	rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
		// 	status: 'Active',
		//   },
		//   {
		// 	attached_groups: 'Ronjas VM Groups',
		// 	id: 'l',
		// 	name: 'Load Balancer 5',
		// 	port: 80,
		// 	protocol: 'HTTP',
		// 	rule: 'DNS delegation robin Load Balancer 3 Load Balancer robin Load Balancer 3 Load Balancer',
		// 	status: 'Active',
		//   },
	  ];

	  document.title = "Carbon Data Table"
	   
	return (
		<div>
		
			{/* <Checkbox /> */}

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
					<TableContainer title="Vijay - Carbon DataTable with batch actions">
						<TableToolbar>
							<TableBatchActions {...getBatchActionProps()}>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={TrashCan}
									onClick={() => console.log('delete clicked')}
								>
									Delete
								</TableBatchAction>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={Save}
									onClick={() => console.log('save clicked')}
								>
									Save
								</TableBatchAction>
								<TableBatchAction
									tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
									renderIcon={Download}
									onClick={() => console.log('download clicked')}
								>
									Download
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
									<TableToolbarAction primaryFocus onClick={() => alert('Alert 1')}>
										Action 1
									</TableToolbarAction>
									<TableToolbarAction onClick={() => alert('Alert 2')}>
										Action 2
									</TableToolbarAction>
									<TableToolbarAction onClick={() => alert('Alert 3')}>
										Action 3
									</TableToolbarAction>
								</TableToolbarMenu>
								<Button
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onClick={() => console.log('clicked')}
									size="small"
									kind="primary"
								>
									Add new
								</Button>
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
											<TableCell key={cell.id}>{cell.value}</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>

					<Pagination
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
					disabled={false} isLastPage={false} pagesUnknown={false} />
					</TableContainer>
				)}
			</DataTable>

			
		</div>

	);
}