import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import HeaderNavbar from '../HeaderNavbar'
import DashboardDialog from './DashboardDialog'
import PieChart from './PieChart'
import { Chart } from "react-google-charts";

import {  Typography, Paper, Grid } from '@mui/material';

import Tooltip from '@mui/material/Tooltip';
const headCells = [
  {
    field: 'id',
    numeric: false,
    width: 50,
    sortable: true,
    editable: true,
    headerName: 'Id',
  },
  {
    field:  'title',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'Title',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.title}>
      <span> {currentRow?.title}</span>
    </Tooltip>
    }
  },
  {
    field: 'description',
    numeric: true,
    minWidth: 375,
    
    sortable: true,
    editable: true,
    headerName: 'Description', 
    valueGetter: (params) =>
      `${params.row?.description || ''}`,
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.description}>
      <span> {currentRow?.description}</span>
    </Tooltip>
    } 
  },
  {
    field: 'pubDate',
    numeric: true,
    width: 150,
    sortable: true,
    editable: true,
    headerName: 'pubDate',
  },
  {
    field: 'link',
    numeric: true,
    width: 385,
    sortable: true,
    editable: true,
    headerName: 'link',
    renderCell: (param) => {
      const currentRow = param.row;
      return <Tooltip title={currentRow?.link}>
      <a href={currentRow.link}> {currentRow.link}</a>
    </Tooltip>
    }
  },
 
 
];

export default function ScannedReportsDataGrid() {
  const [cveRows, setCveRows] = React.useState([]);

  const [hcrows, setHcrows] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
   
  React.useEffect(() => {
    setLoader(true); 


    // UserService.getApi().then((results) => {
    //   if (results.status === 200) {
    //     let hcList = results.data;

    //     setHcrows(hcList);
    //     setLoader(false)
    //   }
    // }).catch((error) => {
    //   console.log("error", error)
    //   alert("Fail to connect get HC API " + error);
    // });

    let cveData = {
      "rss": { 
        "channel": {
          "title": "Latest security vulnerabilities Microsoft products  (CVSS score &gt;= 10)",
          "link": "http://www.cvedetails.com",
          "description": "Security vulnerability feeds by http://www.cvedetails.com",
          "language": "en-us",
          "item": [
            {
              "title": "CVE-2022-30136",
              "description": "Windows Network File System Remote Code Execution Vulnerability. (CVSS:10.0) (Last Update:2022-06-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2022-30136/",
              "pubDate": "2022-06-15", 
            },
            {
              "title": "CVE-2022-26809",
              "description": "Remote Procedure Call Runtime Remote Code Execution Vulnerability. This CVE ID is unique from CVE-2022-24492, CVE-2022-24528. (CVSS:10.0) (Last Update:2022-04-19)",
              "link": "http://www.cvedetails.com/cve/CVE-2022-26809/",
              "pubDate": "2022-04-15",
            },
            {
              "title": "CVE-2022-21907",
              "description": "HTTP Protocol Stack Remote Code Execution Vulnerability. (CVSS:10.0) (Last Update:2022-08-26)",
              "link": "http://www.cvedetails.com/cve/CVE-2022-21907/",
              "pubDate": "2022-01-11"
            },
            {
              "title": "CVE-2022-21898",
              "description": "DirectX Graphics Kernel Remote Code Execution Vulnerability. This CVE ID is unique from CVE-2022-21912. (CVSS:10.0) (Last Update:2022-05-23)",
              "link": "http://www.cvedetails.com/cve/CVE-2022-21898/",
              "pubDate": "2022-01-11"
            },
            {
              "title": "CVE-2022-21874",
              "description": "Windows Security Center API Remote Code Execution Vulnerability. (CVSS:10.0) (Last Update:2022-05-23)",
              "link": "http://www.cvedetails.com/cve/CVE-2022-21874/",
              "pubDate": "2022-01-11"
            },
            {
              "title": "CVE-2021-43907",
              "description": "Visual Studio Code WSL Extension Remote Code Execution Vulnerability (CVSS:10.0) (Last Update:2022-01-01)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-43907/",
              "pubDate": "2021-12-15"
            },
            {
              "title": "CVE-2021-42313",
              "description": "Microsoft Defender for IoT Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-41365, CVE-2021-42310, CVE-2021-42311, CVE-2021-42314, CVE-2021-42315, CVE-2021-43882, CVE-2021-43889. (CVSS:10.0) (Last Update:2021-12-30)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-42313/",
              "pubDate": "2021-12-15"
            },
            {
              "title": "CVE-2021-42311",
              "description": "Microsoft Defender for IoT Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-41365, CVE-2021-42310, CVE-2021-42313, CVE-2021-42314, CVE-2021-42315, CVE-2021-43882, CVE-2021-43889. (CVSS:10.0) (Last Update:2022-07-12)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-42311/",
              "pubDate": "2021-12-15"
            },
            {
              "title": "CVE-2021-34473",
              "description": "Microsoft Exchange Server Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-31196, CVE-2021-31206. (CVSS:10.0) (Last Update:2022-07-12)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-34473/",
              "pubDate": "2021-07-14"
            },
            {
              "title": "CVE-2021-28481",
              "description": "Microsoft Exchange Server Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-28480, CVE-2021-28482, CVE-2021-28483. (CVSS:10.0) (Last Update:2021-04-14)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-28481/",
              "pubDate": "2021-04-13"
            },
            {
              "title": "CVE-2021-28480",
              "description": "Microsoft Exchange Server Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-28481, CVE-2021-28482, CVE-2021-28483. (CVSS:10.0) (Last Update:2021-04-14)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-28480/",
              "pubDate": "2021-04-13"
            },
            {
              "title": "CVE-2021-26897",
              "description": "Windows DNS Server Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-26877, CVE-2021-26893, CVE-2021-26894, CVE-2021-26895. (CVSS:10.0) (Last Update:2021-09-13)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-26897/",
              "pubDate": "2021-03-11"
            },
            {
              "title": "CVE-2021-26895",
              "description": "Windows DNS Server Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-26877, CVE-2021-26893, CVE-2021-26894, CVE-2021-26897. (CVSS:10.0) (Last Update:2021-03-18)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-26895/",
              "pubDate": "2021-03-11"
            },
            {
              "title": "CVE-2021-26894",
              "description": "Windows DNS Server Remote Code Execution Vulnerability This CVE ID is unique from CVE-2021-26877, CVE-2021-26893, CVE-2021-26895, CVE-2021-26897. (CVSS:10.0) (Last Update:2021-09-13)",
              "link": "http://www.cvedetails.com/cve/CVE-2021-26894/",
              "pubDate": "2021-03-11"
            },
            {
              "title": "CVE-2020-17118",
              "description": "Microsoft SharePoint Remote Code Execution Vulnerability This CVE ID is unique from CVE-2020-17121. (CVSS:10.0) (Last Update:2021-03-03)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-17118/",
              "pubDate": "2020-12-10"
            },
            {
              "title": "CVE-2020-17105",
              "description": "AV1 Video Extension Remote Code Execution Vulnerability (CVSS:10.0) (Last Update:2020-11-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-17105/",
              "pubDate": "2020-11-11"
            },
            {
              "title": "CVE-2020-17051",
              "description": "Windows Network File System Remote Code Execution Vulnerability (CVSS:10.0) (Last Update:2020-11-23)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-17051/",
              "pubDate": "2020-11-11"
            },
            {
              "title": "CVE-2020-1350",
              "description": "A remote code execution vulnerability exists in Windows Domain Name System servers when they fail to properly handle requests, aka &#039;Windows DNS Server Remote Code Execution Vulnerability&#039;. (CVSS:10.0) (Last Update:2022-07-12)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-1350/",
              "pubDate": "2020-07-14"
            },
            {
              "title": "CVE-2020-0690",
              "description": "An elevation of privilege vulnerability exists when DirectX improperly handles objects in memory, aka &#039;DirectX Elevation of Privilege Vulnerability&#039;. (CVSS:10.0) (Last Update:2021-07-21)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-0690/",
              "pubDate": "2020-03-12"
            },
            {
              "title": "CVE-2020-0610",
              "description": "A remote code execution vulnerability exists in Windows Remote Desktop Gateway (RD Gateway) when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Windows Remote Desktop Gateway (RD Gateway) Remote Code Execution Vulnerability&#039;. This CVE ID is unique from CVE-2020-0609. (CVSS:10.0) (Last Update:2021-07-21)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-0610/",
              "pubDate": "2020-01-14"
            },
            {
              "title": "CVE-2020-0609",
              "description": "A remote code execution vulnerability exists in Windows Remote Desktop Gateway (RD Gateway) when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Windows Remote Desktop Gateway (RD Gateway) Remote Code Execution Vulnerability&#039;. This CVE ID is unique from CVE-2020-0610. (CVSS:10.0) (Last Update:2021-07-21)",
              "link": "http://www.cvedetails.com/cve/CVE-2020-0609/",
              "pubDate": "2020-01-14"
            },
            {
              "title": "CVE-2019-1449",
              "description": "A security feature bypass vulnerability exists in the way that Office Click-to-Run (C2R) components handle a specially crafted file, which could lead to a standard user, any AppContainer sandbox, and Office LPAC Protected View to escalate privileges to SYSTEM.To exploit this bug, an attacker would have to run a specially crafted file, aka &#039;Microsoft Office ClickToRun Security Feature Bypass Vulnerability&#039;. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-1449/",
              "pubDate": "2019-11-12"
            },
            {
              "title": "CVE-2019-1372",
              "description": "An remote code execution vulnerability exists when Azure App Service/ Antares on Azure Stack fails to check the length of a buffer prior to copying memory to it.An attacker who successfully exploited this vulnerability could allow an unprivileged function run by the user to execute code in the context of NT AUTHORITY\\system thereby escaping the Sandbox.The security update addresses the vulnerability by ensuring that Azure App Service sanitizes user inputs., aka &#039;Azure App Service Remote Code Execution Vulnerability&#039;. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-1372/",
              "pubDate": "2019-10-10"
            },
            {
              "title": "CVE-2019-1226",
              "description": "A remote code execution vulnerability exists in Remote Desktop Services â€“ formerly known as Terminal Services â€“ when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Remote Desktop ServicesÂ Remote Code Execution Vulnerability&#039;. This CVE ID is unique from CVE-2019-1181, CVE-2019-1182, CVE-2019-1222. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-1226/",
              "pubDate": "2019-08-14"
            },
            {
              "title": "CVE-2019-1222",
              "description": "A remote code execution vulnerability exists in Remote Desktop Services â€“ formerly known as Terminal Services â€“ when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Remote Desktop ServicesÂ Remote Code Execution Vulnerability&#039;. This CVE ID is unique from CVE-2019-1181, CVE-2019-1182, CVE-2019-1226. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-1222/",
              "pubDate": "2019-08-14"
            },
            {
              "title": "CVE-2019-1182",
              "description": "A remote code execution vulnerability exists in Remote Desktop Services â€“ formerly known as Terminal Services â€“ when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Remote Desktop ServicesÂ Remote Code Execution Vulnerability&#039;. This CVE ID is unique from CVE-2019-1181, CVE-2019-1222, CVE-2019-1226. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-1182/",
              "pubDate": "2019-08-14"
            },
            {
              "title": "CVE-2019-1181",
              "description": "A remote code execution vulnerability exists in Remote Desktop Services â€“ formerly known as Terminal Services â€“ when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Remote Desktop ServicesÂ Remote Code Execution Vulnerability&#039;. This CVE ID is unique from CVE-2019-1182, CVE-2019-1222, CVE-2019-1226. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-1181/",
              "pubDate": "2019-08-14"
            },
            {
              "title": "CVE-2019-0708",
              "description": "A remote code execution vulnerability exists in Remote Desktop Services formerly known as Terminal Services when an unauthenticated attacker connects to the target system using RDP and sends specially crafted requests, aka &#039;Remote Desktop Services Remote Code Execution Vulnerability&#039;. (CVSS:10.0) (Last Update:2021-06-03)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-0708/",
              "pubDate": "2019-05-16"
            },
            {
              "title": "CVE-2019-0586",
              "description": "A remote code execution vulnerability exists in Microsoft Exchange software when the software fails to properly handle objects in memory, aka &quot;Microsoft Exchange Memory Corruption Vulnerability.&quot; This affects Microsoft Exchange Server. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2019-0586/",
              "pubDate": "2019-01-08"
            },
            {
              "title": "CVE-2018-8626",
              "description": "A remote code execution vulnerability exists in Windows Domain Name System (DNS) servers when they fail to properly handle requests, aka &quot;Windows DNS Server Heap Overflow Vulnerability.&quot; This affects Windows Server 2012 R2, Windows Server 2019, Windows Server 2016, Windows 10, Windows 10 Servers. (CVSS:10.0) (Last Update:2020-08-24)",
              "link": "http://www.cvedetails.com/cve/CVE-2018-8626/",
              "pubDate": "2018-12-12"
            }
          ]
        }
      }
  }; 

  cveData.rss?.channel?.item.forEach((element, i) => {
    element.id = i+1; 
  });

  console.log('cvedata', cveData.rss?.channel?.item)
  setCveRows(cveData.rss?.channel?.item)
  setLoader(false); 

  }, []); 

  function CustomToolbarExport() {
    return (
      <GridToolbarContainer>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (

    <Box sx={{ height: 500, width: '100%',   }}>
      <HeaderNavbar />
      <br />
      


      <Paper  style={{  height: '80%', width: '99%', paddingBottom: "30px", paddingLeft: "5px"  }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
            <PieChart chartType={"PieChart"}/>
          </Grid>

          <Grid xs display="flex" justifyContent="right" alignItems="right">
            <PieChart chartType={"ColumnChart"}/>
          </Grid>
        </Grid>

        </Paper>

      <Paper style={{  height: '80%', width: '99%', paddingBottom: "30px", paddingLeft: "5px"  }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
          <Typography id="cve-details" variant='h6' color="primary" style={{padding: "5px"}}> CVE Details </Typography>
          </Grid>
        
          <Grid xs display="flex" justifyContent="right" alignItems="right">
          
          </Grid>
        </Grid>

        <DataGrid 
        
        rows={cveRows}
        columns={headCells}
        loading={loader}    
        autoPageSize
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        density="compact"
        components={{
          Toolbar:  CustomToolbarExport 
        }}

      />
      </Paper>

      <br />
      <DashboardDialog />


    </Box>
  );
}
