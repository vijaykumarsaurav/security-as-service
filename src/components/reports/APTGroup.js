import React from "react";
import { Chart } from "react-google-charts";



export default function App({ chartType,  aptData }) {

    let options = {
        title: "CVE vs APT Group",
    }; 
    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    

    let keys = Object.keys(aptData); 
   let data1 = [  [
    'Element',
    'Density',
    { role: 'style' },
    {
      sourceColumn: 0,
      role: 'annotation',
      type: 'string',
      calc: 'stringify',
    },
  ],  ]; 
   keys?.forEach(key => {
       let value =  aptData[key]; 
      data1.push([key,  value, getRandomColor(), null])
    });

    console.log('aptgg', data1, aptData)

  return (
    // <Chart
    //   chartType={chartType}
    //   data={data1}
    //   options={options}
    //   width={"100%"}
    //   height={"400px"}

    // />
    <Chart
    width={'800px'}
    height={'300px'}
    chartType="ColumnChart"
    loader={<div>Loading Chart</div>}
    data={data1}
    options={{
      title: 'CVE vs APT Group',
      width: 800,
      height: 400,
      bar: { groupWidth: '95%' },
      legend: { position: 'none' },
    }}
  />
  );
}
