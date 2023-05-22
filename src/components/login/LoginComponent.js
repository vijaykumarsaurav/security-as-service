import React from 'react';
import UserService from "../service/UserService";
import { Grid, Container, Paper, Typography, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
// import LoginNewUI from './LoginNewUI';
import PersonIcon from '@mui/icons-material/Person';
import { loginRedirect } from "../utils/AuthErrorHandler";
import KemstryLogo from './kemstry-logo.png';
import { Tile,Form, Stack, TextInput, TextArea, Select, SelectItem, Button, FormGroup, Checkbox } from '@carbon/react';
import "./Login.scss";

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            isDasable: false,
            isError: false,
        };
        this.login = this.login.bind(this);

    }

    render() {

        return (
            <React.Fragment>

                {/* <div className='LoginPage'> 

                <h1>Login</h1>
                <Form >
                    <FormGroup legendText="">
                    <TextInput
                        id="username1"
                        name="username1"
                        labelText="Username"
                        placeholder="Enter your username"
                         onChange={this.onChange}
                    />
                    </FormGroup>
                    <FormGroup legendText="">
                    <TextInput.PasswordInput
                        id="password"
                        name="password"
                        labelText="Password"
                        placeholder="Enter your password"
                        value={this.state.password} onChange={this.onChange}
                    />
                    </FormGroup>
                    <Checkbox id="rememberMe" labelText="Remember me" />
                    <Button 
                    type="button"
                    disabled={this.state.isDasable}

                    onClick={this.login}>Log in</Button>
                </Form>
                </div> */}

<br /><br /><br />
          
                     <Container maxWidth="sm" style={{ textAlign: "center", verticalAlign:'center' }}>
                     <Tile>
               

                    <img src={KemstryLogo} style={{ width: "80px" }} />
                    <h1>KEMistry Login </h1>
                    <Form >
                        <FormGroup legendText="">
                            <TextInput
                                id="userName"
                                name="userName"
                                labelText="Username"
                                placeholder="Enter your username"
                                value={this.state.userName}
                                onChange={this.onChange}
                            />
                        </FormGroup>
                        <FormGroup legendText="">
                            <TextInput.PasswordInput
                                id="password"
                                name="password"
                                labelText="Password"
                                placeholder="Enter your password"
                                value={this.state.password} onChange={this.onChange}
                            />
                        </FormGroup>
                        <Checkbox id="rememberMe" labelText="Remember me" />

                        {/* <TextField type="text" required={true} label="User Id" fullWidth margin="normal" name="userName" value={this.state.userName} onChange={this.onChange} /> */}

                        {/* <TextField type="password" required={true} label="Password" fullWidth margin="normal" name="password" value={this.state.password} onChange={this.onChange} /> */}

                        <Grid item xs={12} sm={12} justify={"center"} container>
                            <Button disabled={this.state.isDasable} variant="contained" color="primary" onClick={this.login}  > Login </Button>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            {this.state.isDasable ? <InputLabel variant="subtitle1" style={styles.waitMessage}> Please wait...</InputLabel> : ""}
                            {this.state.isError ? <InputLabel variant="subtitle1" style={styles.errorMessage}> {this.state.isError} </InputLabel> : ""}
                        </Grid>
                    </Form>
                    </Tile>

                </Container>
               

           

            </React.Fragment>


        )

    }

    componentDidMount() {
        this.checkBasicAuth();

        if (decodeURIComponent(window.location.href.split('?')[1]) === 'loggedout=true') {
            window.location.replace('#/login')
            window.location.reload(true);
        }


    }

    checkBasicAuth() {
        UserService.whoAmI()
            .then(loginRes => {

              //  console.log("res", loginRes);

                if (loginRes.status === 401) {
                    document.location.href = '#/login';
                }
                if (loginRes.status === 200 && loginRes.data) {
                    document.location.href = '#/dashboard';
                }
            });
    }

    getOrgList = (callback) => {
        UserService.getOrgList()
            .then(result => {

                console.log('listorg', result.data)
                if (result.status === 200) {

                    if (result.data.length === 1) {
                        localStorage.setItem('selectedOrg', result.data[0])
                    }
                    localStorage.setItem('orgList', JSON.stringify(result.data));
                    callback();
                }

            }).catch(error => {
                loginRedirect(error);

            });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.trim() });
     //   console.log(e.target.name, e.target.value)
    }

    login = (e) => {

        this.setState({ isError: "" });

        //   e.preventDefault();

        if (!this.state.userName && !this.state.password) {
            this.setState({ isError: "User Id and Password are required." });
            return;
        }

        if (!this.state.userName) {
            this.setState({ isError: "User Id is required." });
            return;
        }
        if (!this.state.password) {
            this.setState({ isError: "Password is required." });
            return;
        }
        console.log("loginclicked ")

        this.setState({ isDasable: true });

        let base64String = 'Basic ' + btoa(`${this.state.userName}:${this.state.password}`);

        console.log("base64String", base64String)
        UserService.whoAmI(base64String)
            .then(loginRes => {
                console.log("res", loginRes);
                if (loginRes.status === 200) {

                    localStorage.setItem('userName', loginRes?.data)
                    this.getOrgList(() => {
                        //window.location.replace("#/dashboard");  
                        this.props.history.push('/dashboard')
                    })
                }
            }).catch(error => {
                this.setState({ isError: error.response.data?.message, isDasable: false });
                //    console.log("error.message",error.response.status, error.response.data); 
            })

    }

}

const styles = {
    formStyle: {
        display: 'flex',
        flexFlow: 'row wrap'
    },
    label: {
        display: 'flex',
        justifyContent: 'center'
    },
    errorMessage: {
        color: "red",
        marginTop: '11px'
    },
    waitMessage: {
        color: "gray",
        marginTop: '11px'

    }

}

export default LoginComponent;