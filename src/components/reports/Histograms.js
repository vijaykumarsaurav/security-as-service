import React from 'react';
import ReactDOM from "react-dom";
import { HistogramChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

function Histograms() {
	const data = [
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
		"group": "CVE-2023-0001",
		"NO_of_exposures": 5
	},
	{
		"group": "CVE-2023-0001",
		"NO_of_exposures": 5
	},
	{
		"group": "CVE-2023-0002",
		"NO_of_exposures": 5
	},
	{
		"group": "CVE-2023-0002",
		"NO_of_exposures": 5
	},
	{
		"group": "CVE-2023-0001",
		"NO_of_exposures": 2
	},
	{
		"group": "CVE-2023-0001",
		"NO_of_exposures": 3
	},
	{
		"group": "CVE-2023-0003",
		"NO_of_exposures": 1
	},
	{
		"group": "CVE-2023-0003",
		"NO_of_exposures": 5
	},
	{
		"group": "CVE-2023-0002",
		"NO_of_exposures": 3
	},
	{
		"group": "CVE-2023-0002",
		"NO_of_exposures": 6
	},
	{
		"group": "CVE-2023-0001",
		"NO_of_exposures": 7
	}
]
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
	// };

	return (
		<HistogramChart
			data={data}
			options={options}>
		</HistogramChart>
	);
}

export default Histograms