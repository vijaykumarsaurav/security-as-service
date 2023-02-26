import React from "react";
import { Chart } from "react-google-charts";



export default function App({ chartType,  cveAffectedComputer }) {

    let options = {
        title: "CVE Analysis - Computers Affected",
    }; 


    let keys = Object.keys(cveAffectedComputer); 
   let data1 = [  ["Task", "CVE Affected Computers"]  ]; 
   keys?.forEach(key => {
       let value =  cveAffectedComputer[key]; 
      data1.push([key,  value ])
    });

  return (
    <Chart
      chartType={chartType}
      data={data1}
      options={options}
      width={"100%"}
      height={"400px"}

    />
  );
}
