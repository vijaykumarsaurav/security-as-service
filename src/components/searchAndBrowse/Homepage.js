import React, { Component } from 'react';
import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService'
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

import Button from '@mui/material/Button';

import { resolveResponse } from "../utils/ResponseHandler";
class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            categoryList: [], 
            categoryWaitingFlag: true
        }
    }


    componentDidMount() {
        UserService.getCategory()
            .then((res) => {
                //   let data = resolveResponse(res); //common response handler
                if (res && res.data) {
                    this.setState({ categoryList: res.data , categoryWaitingFlag:false})
                }
            });
    }

    handleClick =(row)=>{
        console.log(row)
        this.props.history.push('/product-category?q='+row);
    }

    capitalizeFirstLetter =(string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    render() {
        return (
            <React.Fragment>
                <HeaderNavbar history={this.props} />

                <Grid direction="row" container spacing={5} style={{ padding: "20px" }}>

                    <Grid item xs={12} sm={12} >
                        <Typography variant="h5" component="p" >
                            Top Categories
                        </Typography>
                    </Grid>

                    {this.state.categoryList && this.state.categoryList.map(row => (
                        <Grid key={row} item xs={12} sm={3} style={{ textAlign: "center" }}>
                            <div onClick={()=> this.handleClick(row)} style={{ textAlign: "center", cursor:'pointer' }} > 
                                <img src="https://winaero.com/blog/wp-content/uploads/2019/11/Photos-new-icon.png" /> <br />
                                {this.capitalizeFirstLetter(row)}
                            </div>
                        </Grid>
                    ))}  

                    {this.state.categoryWaitingFlag ? <CircularProgress  style={{padding:"25px"}}  /> : ""}
                </Grid>



                <Grid direction="row" container spacing={5} style={{ padding: "20px" }}>

                    <Grid item xs={12} sm={12} >
                        <Typography variant="h5" component="p" >
                            Other Same Categories
                        </Typography>
                    </Grid>

                    {this.state.categoryList && this.state.categoryList.map(row => (
                        <Grid key={row} item xs={12} sm={3} style={{ textAlign: "center" }}>
                            <div onClick={()=> this.handleClick(row)} style={{ textAlign: "center", cursor:'pointer' }} > 
                                <img src="https://winaero.com/blog/wp-content/uploads/2019/11/Photos-new-icon.png" /> <br />
                                {this.capitalizeFirstLetter(row)}
                            </div>
                        </Grid>
                    ))}  

                </Grid>


            </React.Fragment>
        );
    }
}

export default Homepage;