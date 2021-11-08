import React from 'react';
import './App.css';
import AppRouter from "./components/RouterComponent";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
//import LoginComponent from "./login/LoginComponent";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';


import LoginComponent from "./components/login/LoginComponent";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Tondo'],
  },});

function App() {
  const token = window.localStorage.getItem("token"); 

  // if(!token){
  //    window.location.replace(window.location.pathname + "/#/login");  
  // }

  return (
    <React.Fragment>
        <ThemeProvider theme={theme}>
          <AppRouter/>
          <ToastContainer/>
        </ThemeProvider>
        
    </React.Fragment>
  );
}

export default App;
