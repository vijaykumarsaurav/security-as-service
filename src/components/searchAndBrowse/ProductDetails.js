import React, { Component } from 'react';
import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService'
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import './ProductStyle.css';
import Button from '@mui/material/Button';
import Notify from '../utils/Notify'
import BasicBreadcrumbs from './BasicBreadcrumbs'

import { resolveResponse } from "../utils/ResponseHandler";
class ProductDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            productDetails: "",
            waitingFlag: true,
            quantity: 1, 
            message: "", 
            totalItemIntoCart:0
        }
    }


    componentDidMount() {
        let productId = window.location.href.split('?')[1] && window.location.href.split('?')[1].split('=')[1];
        UserService.getProductDetails(productId)
            .then((res) => {
                //   let data = resolveResponse(res); //common response handler

                console.log(res.data);
                if (res && res.data) {
                    this.setState({
                        title: res.data.title,
                        waitingFlag: false,
                        productDetails: res.data
                    })
                }
            });

    }

    addToCart = (productDetails) => {
       let cartList = localStorage.getItem('cartList') ? JSON.parse(localStorage.getItem('cartList')) : []; 
       console.log("cartList",cartList);
        let cartMsg=''; 
       let isProductAlreadyAdded = cartList.filter((item)=>item.productId == productDetails.id); 
       if(isProductAlreadyAdded.length === 0){
        cartList.push({
            productId: productDetails.id, 
            price: productDetails.price, 
            title:productDetails.title, 
            image:productDetails.image, 
            quantity: parseInt(this.state.quantity)  
        })
        cartMsg = `${this.state.quantity} ${this.state.quantity >1 ? "same items added" : "item added"}`; 
       }else{
         isProductAlreadyAdded[0].quantity = parseInt(isProductAlreadyAdded[0].quantity) +  parseInt(this.state.quantity); 
         cartMsg = `${isProductAlreadyAdded[0].quantity} same items added`; 
       }

       this.setState({message : cartMsg,  totalItemIntoCart:cartList.length}); 
    //    setTimeout(() => {
    //     this.setState({message : ''}); 
    //    }, 5000);
     //  Notify.showSuccess(msg);
       localStorage.setItem('cartList', JSON.stringify(cartList)); 
    }

    quantityChange = (e) => {
        if (e.target.value <= 0)
            this.setState({ quantity: 1 })
        else
            this.setState({ quantity: e.target.value })
    }
    render() {

        let productDetails = this.state.productDetails;
        console.log("productDetails", productDetails)

        return (
            <React.Fragment>
                <HeaderNavbar totalItem={this.state.totalItemIntoCart}/>

                {this.state.waitingFlag ? <CircularProgress style={{ padding: "25px" }} /> : <Grid direction="row" container spacing={5} style={{ padding: "20px" }}>

                <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
                <BasicBreadcrumbs />
                    </Grid>
                  

                    <Grid item xs={12} sm={6} style={{ textAlign: "center" }}>
                        <Paper style={{ textAlign: "center", cursor: 'pointer', padding: "10px" }} >
                            <img style={{ width: "50%", height: "400px" }} src={productDetails.image} /> <br />
                            {productDetails.title}
                        </Paper>
                       
                    </Grid>

                    <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
                        <Typography variant="h5" component="p" >
                            {productDetails.title}
                        </Typography>
                        <br />
                        <Typography variant="h5" component="p" >
                            &#8377; {productDetails.price}
                        </Typography>
                        <br />
                        Ratings {productDetails.rating && productDetails.rating.rate}* ({productDetails.rating && productDetails.rating.count})
                        <br /> <br />
                        <TextField type="number" onChange={this.quantityChange} value={this.state.quantity} style={{ width: "100px" }} />
                        <br /> <br />
                        <Button variant="contained" onClick={() => this.addToCart(productDetails)}> Add To Cart </Button>

                        <br /><br /> <b> {this.state.message} </b>
                        <br /> <br />
                        <Typography variant="h6" component="p" >
                        {productDetails.description}
                        </Typography> 

                    </Grid>

                </Grid>}


            </React.Fragment>
        );
    }
}

export default ProductDetails;