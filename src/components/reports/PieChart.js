import React from "react";
import { Chart } from "react-google-charts";



export default function App({ chartType,  cveRows }) {

    let options = {
        title: "CVE Analysis - Outstanding CVE breakdown",
    }; 
    if(chartType === 'ColumnChart'){
        options.title = "CVE Analysis - CVE Migrated within"
    }
    console.log('cveRows', cveRows)

    let data = [
        ["Task", "Hours per Day"],
        ["High", cveRows?.HIGH],
        ["Critical", cveRows?.CRITICAL],
        ["Medium", cveRows?.MEDIUM],
        ["Low", cveRows?.LOW],
      ];

  return (
    <Chart
      chartType={chartType}
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}

    />
  );
}
