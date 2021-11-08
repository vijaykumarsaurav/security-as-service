import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoginNavBar from "../LoginNavbar";
import Parser from 'html-react-parser';
import InputLabel from '@material-ui/core/InputLabel';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Bharti Airtel Ltd
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#df0915',//theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }, 
  errorMessage:{
    color:"red",
    marginTop: '11px'
  },
  waitMessage:{
    color:"gray",
    marginTop: '11px'

}


}));




export default function SignIn(props) {
  const classes = useStyles();

  console.log(props);

  const handleOnChange = e => {
    props.loginProps.onChange(e);
  };

  const handleMobile = e => {
    props.loginProps.onChangeMobileNo(e);
  };

  const handleOtp = e => {
    props.loginProps.onChangeOtp(e);
  };
  const handleNic = e => {
    props.loginProps.onChangeNic(e);
  };

  return (
    <>
    {/* <LoginNavBar/> */}

    <Container component="main" xs sm maxWidth="sm">

      <CssBaseline />
      <div className={classes.paper}>
      <Typography component="h1" variant="h5">
          Check DIY Status
        </Typography>
       
        <form className={classes.form} noValidate>
        
          
          <InputLabel htmlFor="Front" required={true}>SIM Reference Number</InputLabel>            <br />

           <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="simRefNumber"
             //   label="Enter your NIC number | හැදුනුම්පත්  අංකය ඇතුලත් කරන්න | உங்கள் என்.ஐ.சி. எண்ணை உள்ளிடவும்"
                type="text"
                autoFocus
                id="simRefNumber"
                onChange={handleNic}
                disabled={props.loginProps.otpFlag}
                value={props.loginProps.simRefNumber}
              />

          <InputLabel htmlFor="Front" required={true}>Enter your Alternate Number</InputLabel>            <br />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
          //  label="Enter your Mobile Number | දුරකථන අංකය ඇතුලත් කරන්න | உங்களுடைய கைபேசி எண்ணை உள்ளிடவும்"
            name="alternateNum"
            disabled={props.loginProps.otpFlag}
            onChange={handleMobile}
            value={props.loginProps.alternateNum}
          />
         { props.loginProps.otpFlag ?  
         <> 
        
   
         </> : ""
         }
  

          <div container style={{textAlign: 'center'}} >
                {props.loginProps.isDasable ? <InputLabel variant="subtitle1" className={classes.waitMessage}> <br /> Please wait...</InputLabel> :""} 
                {props.loginProps.isError ? <InputLabel variant="subtitle1" className={classes.errorMessage}><br />  {props.loginProps.isError} </InputLabel>: ""}  
          </div>
       
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            //style={{backgroundColor:'red', color:'white'}}
            className={classes.submit}
            onClick={ props.loginProps.actionText == "Send OTP" ? props.loginProps.sendOtp : props.loginProps.login }
          >

           {props.loginProps.actionText === "Login" ? Parser("Next <br /> ඉදිරියට <br />அடுத்து")   : Parser('Click to check Status')}
          
          </Button>

         
          
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot otpCode?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
    </>
  );
}







// method calling

// import React from "react";
// import "./styles.css";

// class Child extends React.Component {
//   render() {
//     return <input name="username" onChange = {this.props.handler}/ >
//   }
// }

// class Parent extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       username : "vijay"
//     }
//     this.handler = this.handler.bind(this)
//   }

//   handler(e) {
//     console.log(e.target.name ); 
//     this.setState({
//       [e.target.name]: e.target.value 
//     })
//   }

//   render() {
//     return <>
//     Hello:  {this.state.username} 
//      <Child handler = {this.handler} />
     
//      </>
//   }
// }

// export default Parent;
