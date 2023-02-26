import React from "react";
import { Chart } from "react-google-charts";



export default function App({ chartType,  aptData }) {

    let options = {
        title: "CVE vs APT Group",
    }; 
    

    let keys = Object.keys(aptData); 
   let data1 = [  ["Task", "CVE vs APT Group"]  ]; 
   keys?.forEach(key => {
       let value =  aptData[key]; 
      data1.push([key,  value ])
    });

    console.log('aptgg', data1, aptData)

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
