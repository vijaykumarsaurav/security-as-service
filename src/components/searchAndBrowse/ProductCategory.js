import React, { Component } from 'react';
import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService'
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import BasicBreadcrumbs from './BasicBreadcrumbs'

import { resolveResponse } from "../utils/ResponseHandler";
class ProductCategory extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            ProductCategory: [], 
            waitingFlag: true,
            categoryName: ''
        }
    }


    componentDidMount() {
        
       let queryStr =  window.location.href.split('?')[1] && window.location.href.split('?')[1].split('=')[1]; 
       this.setState({categoryName: decodeURIComponent(queryStr)})
    
        UserService.getProductCategory(queryStr)
            .then((res) => {
                //   let data = resolveResponse(res); //common response handler
                if (res && res.data) {
                    this.setState({ ProductCategory: res.data , waitingFlag:false})
                }
            });
    }

    handleClick =(productId)=>{
        console.log(productId)
        this.props.history.push('/product-details/?id='+productId);
    }
    
    capitalizeFirstLetter =(string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    render() {
        return (
            <React.Fragment>
                <HeaderNavbar />

                <Grid direction="row" container spacing={5} style={{ padding: "20px" }}>

                    <Grid item xs={12} sm={12} >
                        <Typography variant="h5" component="p" >
                           {this.capitalizeFirstLetter(this.state.categoryName)} 
                        </Typography>

                        <BasicBreadcrumbs/>
                    </Grid>

                   


                    {this.state.ProductCategory && this.state.ProductCategory.map(row => (
                        <Grid item xs={12} sm={3} style={{ textAlign: "center" }}>
                            <Paper onClick={()=> this.handleClick(row.id)} style={{ textAlign: "center", cursor:'pointer', padding:"10px" }} > 
                                <img style={{width:"50%", height:"400px"}} src={row.image} /> <br />
                                {row.title} <br /> &#8377; {row.price} <br /> Ratings {row.rating.rate}({row.rating.count})
                            </Paper>
                        </Grid>
                    ))}  

                    {this.state.waitingFlag ? <CircularProgress   style={{padding:"25px"}}  /> : ""}
                </Grid>

            </React.Fragment>
        );
    }
}

export default ProductCategory;