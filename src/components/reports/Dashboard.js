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
import ColumnGraph from './ColumnGraph'
import APTGroup from './APTGroup'

import {  Typography, Paper, Grid } from '@mui/material';
import Histograms from './Histograms'
import UserService from '../service/UserService'

export default function ScannedReportsDataGrid() {
  const [cveRows, setCveRows] = React.useState([]);
  const [cveAffectedComputer, setCveAffectedComputer] = React.useState([]);
  const [aptData, setAptData] = React.useState([]);

  const [loader, setLoader] = React.useState(false);
   
  React.useEffect(() => {
    setLoader(true); 

    UserService.getCveBreakdown().then((results) => {
      if (results.status === 200) {
        setCveRows(results.data);
        setLoader(false)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get  API " + error);
    });

    return () => {
      setCveRows([]); // This worked for me
    };

  }, []); 

  React.useEffect(() => {
    setLoader(true); 

    UserService.getCveAffectedComputers().then((results) => {
      if (results.status === 200) {
        setCveAffectedComputer(results.data);
        setLoader(false)
      }
    }).catch((error) => {
      console.log("error", error)
      alert("Fail to connect get  API " + error);
    });

    return () => {
      setCveAffectedComputer([]); // This worked for me
    };

  }, []); 


  
	React.useEffect(() => {	
		UserService.getCveGroups().then((results) => {
		  if (results.status === 200) {
			let cveGroups1 = results.data;
			setAptData(cveGroups1)
		  }
		}).catch((error) => {
		  console.log("error", error)
		  alert("Fail to connect get  API " + error);
		});
	  }, []); 

  return (


    <Box sx={{ height: 500, width: '100%',   }}>
      <HeaderNavbar />
      <br />
      


      <Paper  style={{  height: '80%', width: '99%', paddingBottom: "30px", paddingLeft: "5px"  }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="center" alignItems="left">
            <PieChart chartType={"PieChart"} cveRows={cveRows}/>
          </Grid>

        
        </Grid>

        <Grid container >

          <Grid xs display="flex" justifyContent="right" alignItems="right">
           
          {cveAffectedComputer  ?<ColumnGraph chartType={"ColumnChart"} cveAffectedComputer={cveAffectedComputer}/> : ""}
             
          </Grid>

        </Grid>

        <Grid container >

        
          <Grid xs display="flex" justifyContent="left" alignItems="left">
           {/* <Histograms/> */}

           {aptData ? <APTGroup chartType={"ColumnChart"} aptData={aptData}/> : ""}

          </Grid>

        </Grid>

       
        </Paper>

      

    </Box>
  );
}
