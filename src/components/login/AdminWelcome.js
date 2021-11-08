import React from 'react';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UserService from "../service/UserService";
import LoginNavBar from "../LoginNavbar";
import { Container } from "@material-ui/core";
import Notify from "../../utils/Notify";
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
//import AdminWelcome from '../adminwelcome.png';
import PostLoginNavBar from "../PostLoginNavbar";
import { resolveResponse } from "../../utils/ResponseHandler";

import { DEV_PROTJECT_PATH } from "../../utils/config";

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

    gotoLoginPage = () => {
        window.localStorage.clear();
        this.props.history.push('/login');
    }

    gotoStatusPage = () => {
        this.props.history.push('/status');
    }


    render() {


        return (
            <React.Fragment>
                {/* <PostLoginNavBar/> */}

                <Grid style={{ display: "visible", textAlign: "center" }} spacing={1} direction="row" container>

                    <Grid item xs={10} sm={12} style={{ textAlign: "center" }}>
                        <div style={{ padding: "10px" }}>
                            <Typography component="h1" variant="h4" style={{ fontWeight: "500" }}>Welcome to airtel Self-Activation portal</Typography>
                            <img src={DEV_PROTJECT_PATH + "webdata/logo.png"} />
                            <br />
                            <Typography variant="h5">Thank you for buying airtel!</Typography>
                            <br />
                            <Typography variant="h5">Keep your Proof of Identity documents and new SIM pack with you.</Typography>


                            <img style={{ width: "60%", }} src={DEV_PROTJECT_PATH + "webdata/welcome.png"} />


                            <br />
                            <Typography variant="h6">You’re Phone / Laptop camera is required to capture your details.</Typography>

                            <p>Browser:
                                Desktop: Google Chrome 77 & Firefox 68 onwards
                                Android: Version 6.0 onwards
                                IOS: Safari 13 browser
                            </p>

                            <Grid direction="row" container className="flexGrow" spacing={1}>


                            <Grid item xs={10} sm={6} style={{ textAlign: "center" }}>
                                <Button
                                    type="button"

                                    variant="contained"
                                    color="primary"
                                    //style={{backgroundColor:'red', color:'white'}}
                                    onClick={this.gotoLoginPage}

                                >

                                    Begin Activation

                                </Button>

                            </Grid>

                            <Grid item xs={10} sm={6} style={{ textAlign: "center" }}>
                                <Button
                                    type="button"

                                    variant="contained"
                                    color="primary"
                                    //style={{backgroundColor:'red', color:'white'}}
                                    onClick={this.gotoStatusPage}

                                >

                                    Check Status / Re-Activation

                                </Button>
                            </Grid>

</Grid>





                        </div>


                    </Grid>



                </Grid>


            </React.Fragment>
        )


    }

    componentDidMount() {
        const token = window.localStorage.getItem("token");
        //   if(token){
        //     const lastUrl = localStorage.getItem("lastUrl"); 
        //     this.props.history.push('/'+lastUrl);
        //   }

        // ActivationService.checkSession().then(res => {
        //     let data = resolveResponse(res);
        // })

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    }

    login = (e) => {
        e.preventDefault();
        if (!this.state.userName || !this.state.password) {
            this.setState({ isError: "Olms Id and password is required." });

            // setTimeout(() => {
            //     this.setState({ isError: "" });
            // }, 3000);

            //  Notify.showError("Olms Id and password is required.");
            return;
        }

        this.setState({ isDasable: true });

        const loginPayload = {
            userName: this.state.userName,
            password: this.state.password
        };
        UserService.login(loginPayload)
            .then(res => {
                //  Notify.showError("Olms Id and password is required.");
                //  alert(JSON.stringify(res));


                this.setState({ isError: res.data.message });

                //  let data = resolveResponse(res);
                console.log("resolveResponse", data);
                // if(!data.result)
                //     Notify.showError("Something Went worng...");

                var data = res.data;
                this.setState({ isDasable: false });

                // else
                //     resolveResponse(res, "Login success.");

                if (data.result) {
                    window.localStorage.setItem("userDetails", JSON.stringify(data.result));
                    window.localStorage.setItem("token", data.result.token)
                }

                // BO agent : BOA
                // Data Entry : DE
                // Admin : ADMIN
                // Distributor : DIST

                if (data.result && data.result.roleCode == "BOA")
                    this.props.history.push('/verify');

                if (data.result && data.result.roleCode == "DE")
                    this.props.history.push('/dataentry');

                if (data.result && data.result.roleCode == "ADMIN")
                    this.props.history.push('/packs');

                if ((data.result && data.result.roleCode == "DIST") || (data.result && data.result.roleCode == "FSE"))
                    this.props.history.push('/distributor');

            });

        // setTimeout(() => {
        //     this.setState({ isError: "" });
        // }, 3000);




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
    },
    imagestyle: {
        width: "10%",
        height: '10vh'
    }

}

export default LoginComponent;