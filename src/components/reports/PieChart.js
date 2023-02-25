import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Task", "Hours per Day"],
  ["High", 11],
  ["Critical", 2],
  ["Mediam", 2],
  ["Low", 2],
  ["Info", 7],
];

export default function App({ chartType }) {

    let options = {
        title: "CVE Analysis - Outstanding CVE breakdown (2022-2023)",
    }; 
    if(chartType === 'ColumnChart'){
        options.title = "CVE Analysis - CVE Migrated within last (2022-2023)"
    }

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
