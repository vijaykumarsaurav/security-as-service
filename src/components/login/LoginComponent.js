import React from 'react';
import UserService from "../service/UserService";
import {Grid, Container, Typography, TextField, Button} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
// import LoginNewUI from './LoginNewUI';
import PersonIcon from '@mui/icons-material/Person';

class LoginComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "", 
            isDasable:false,
            isError:false,            
        };
        this.login = this.login.bind(this);

    }


    render() {

        return(
            <React.Fragment>
                
                <Container maxWidth="sm">
                     <br/><br/><br/> 

                    <Typography variant="h4" style={styles.label}>  Security as service | Login</Typography>
                    
                    <form style={styles.formStyle}>
                        <TextField type="text"  required={true} label="User Id" fullWidth margin="normal" name="userName" value={this.state.userName}  onChange={this.onChange}/>

                        <TextField type="password"  required={true} label="Password" fullWidth margin="normal" name="password" value={this.state.password} onChange={this.onChange}/>
                      
                        <Grid item  xs={12} sm={12} justify={"center"} container>
                       
                            <Button  disabled={this.state.isDasable}  variant="contained" color="primary" onClick={this.login} fullWidth > Login </Button>
                        </Grid>
                        <Grid item  xs={12} sm={10}>
                             {this.state.isDasable ? <InputLabel variant="subtitle1" style={styles.waitMessage}> Please wait...</InputLabel> :""} 
                             {this.state.isError ? <InputLabel variant="subtitle1" style={styles.errorMessage}> {this.state.isError} </InputLabel>: ""}  
                        </Grid>
                    </form>
                </Container>

                <Grid container justify="space-around">
                    <Grid justify={"center"} container  xs={12} sm={10}>
                            {this.state.isDasable ? <InputLabel variant="subtitle1" style={styles.waitMessage}> Please wait...</InputLabel> :""} 
                            {this.state.isError ? <InputLabel variant="subtitle1" style={styles.errorMessage}> {this.state.isError} </InputLabel>: ""}  
                    </Grid>
                </Grid>
            </React.Fragment>


        )

    }

    componentDidMount() {
      const userTokens =   window.localStorage.getItem("userTokens"); 
      if(userTokens){
      //  const lastUrl = localStorage.getItem("lastUrl"); 
        this.props.history.push('dashboard');
      }

      if(document.location.href.includes('logout')){
        document.location.href = '#/login';
        window.location.reload(true);
      }else{
      }

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    }

    login = (e) => {
        
        this.setState({ isError: "" });


        e.preventDefault();
        window.location.replace('#/dashboard')


        if(!this.state.userName && !this.state.password){
            this.setState({ isError: "User Id and Password are required." });
            return;
        }

        if(!this.state.userName){
            this.setState({ isError: "User Id is required." });
            return;
        }
        if(!this.state.password){
            this.setState({ isError: "Password is required." });
            return;
        }
         
        this.setState({ isDasable: true });

 

        const loginPayload = {
            userName:  this.state.userName,
            password: this.state.password ,

        };

           
    }

}

const styles ={
    formStyle :{
        display: 'flex',
        flexFlow: 'row wrap'
    },
    label: {
        display: 'flex',
        justifyContent: 'center'
    },
    errorMessage:{
        color:"red",
        marginTop: '11px'
    },
    waitMessage:{
        color:"gray",
        marginTop: '11px'

    }

}

export default LoginComponent;