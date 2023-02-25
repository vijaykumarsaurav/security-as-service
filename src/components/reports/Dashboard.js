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
import {  Typography, Paper, Grid } from '@mui/material';
import Histograms from './Histograms'
import UserService from '../service/UserService'

export default function ScannedReportsDataGrid() {
  const [cveRows, setCveRows] = React.useState([]);

  const [hcrows, setHcrows] = React.useState([]);
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

  }, []); 

  return (


    <Box sx={{ height: 500, width: '100%',   }}>
      <HeaderNavbar />
      <br />
      


      <Paper  style={{  height: '80%', width: '99%', paddingBottom: "30px", paddingLeft: "5px"  }}>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
            <PieChart chartType={"PieChart"} cveRows={cveRows}/>
          </Grid>

          <Grid xs display="flex" justifyContent="right" alignItems="right">
            <PieChart chartType={"ColumnChart"} cveRows={cveRows}/>
          </Grid>

        </Grid>

        <Grid container >
          <Grid xs display="flex" justifyContent="left" alignItems="left">
          <Histograms />
          </Grid>

          {/* <Grid xs display="flex" justifyContent="right" alignItems="right">
            <PieChart chartType={"ColumnChart"}/>
          </Grid> */}

        </Grid>

       
        </Paper>

      

    </Box>
  );
}
