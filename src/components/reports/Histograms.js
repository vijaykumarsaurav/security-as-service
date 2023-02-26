import React from 'react';
import ReactDOM from "react-dom";
import { HistogramChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
import UserService from '../service/UserService'

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
				let value =  cveGroups1[key]; 
				temp.push( { "group": key, "NO_of_exposures" : value})
			});
			console.log("data", temp)
			setData(temp)
		  }
		}).catch((error) => {
		  console.log("error", error)
		  alert("Fail to connect get  API " + error);
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

	console.log('cveGroupsData', cveGroupsData, cveGroups)

	return (
		<HistogramChart
			data={data}
			options={options}>
		</HistogramChart>
	);
}