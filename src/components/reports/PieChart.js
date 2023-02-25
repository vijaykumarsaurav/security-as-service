import React from "react";
import { Chart } from "react-google-charts";



export default function App({ chartType,  cveRows }) {

    let options = {
        title: "CVE Analysis - Outstanding CVE breakdown (2022-2023)",
    }; 
    if(chartType === 'ColumnChart'){
        options.title = "CVE Analysis - CVE Migrated within last (2022-2023)"
    }
    console.log('cveRows', cveRows)

    let data = [
        ["Task", "Hours per Day"],
        ["High", cveRows?.HIGH],
        ["Critical", cveRows?.CRITICAL],
        ["Mediam", cveRows?.MEDIUM],
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
