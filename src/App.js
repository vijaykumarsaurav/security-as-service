import React from 'react'; 
import './App.css';
import AppRouter from "./components/RouterComponent";
import Histograms from "./components/reports/Histograms"


function App() {
  return (
    <React.Fragment>
      <AppRouter/>
      {/* <Histograms></Histograms> */}
    </React.Fragment>
  );
}

export default App;
