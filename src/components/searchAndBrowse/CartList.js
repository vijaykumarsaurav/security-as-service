import React, { Component } from 'react';
import HeaderNavbar from '../HeaderNavbar'
import UserService from '../service/UserService'
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { resolveResponse } from "../utils/ResponseHandler";
class CartDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryName: '',
            quantity:0,
            cartList: localStorage.getItem('cartList') ? JSON.parse(localStorage.getItem('cartList')) : [],
            totalPrice:0
        }
    }

    updateTotalPrice =()=>{
        let sum = 0; 
        this.state.cartList.forEach(element => {
            sum += element.quantity * element.price; 
        });

        this.setState({totalPrice : sum})
    }

    componentDidMount() {
       
        this.updateTotalPrice(); 
        
    }

    handleClick = (productId) => {
        console.log(productId)
        this.props.history.push('/product-details/?id=' + productId);
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    updateQty=(row, num)=>{
         //row.quantity = row.quantity + num; 
        
         let tempList = this.state.cartList; 
         tempList.forEach(element => {
            if(element.productId == row.productId){
                element.quantity = row.quantity + num; 
            }
         });

         localStorage.setItem('cartList', JSON.stringify(tempList)); 
         this.setState({cartList : tempList},function(){
            this.updateTotalPrice(); 
         })
    }
    removeQty = (row) => {
  
        let tempList = this.state.cartList; 
        
        let index =''; 
        tempList.forEach((element,i) => {
           if(element.productId == row.productId){
            index  = i
            return
           }
        });
        tempList.splice(index, 1);

        localStorage.setItem('cartList', JSON.stringify(tempList)); 
        this.setState({cartList : tempList},function(){
           this.updateTotalPrice(); 
        })
       
        console.log(row)

    }
    render() {
        return (
            <React.Fragment>
                <HeaderNavbar />

                <Grid direction="row" container spacing={5} style={{ padding: "20px" }}>

                    <Grid item xs={12} sm={12} >
                        <Typography variant="h5" component="p" >
                            Cart({this.state.cartList.length})
                        </Typography>
                    </Grid>


                    {this.state.cartList && this.state.cartList.map(row => (

                        <Grid item xs={12} sm={8}>
                            <Paper>
                                <Grid direction="row" container spacing={1} style={{ padding: "10px" }}>
                                    <Grid item xs={12} sm={4} >
                                        <img style={{ width: "100px", height: "100px" }} src={row.image} />
                                    </Grid>

                                    <Grid item xs={12} sm={8} >
                                        {row.title} <br /> &#8377; {row.price * row.quantity}
                                        <br /> <br />
                                        <Button variant="contained" onClick={()=>this.updateQty(row, 1)}> <AddIcon /> </Button>   
                                        
                                        <span> Qty <b> {row.quantity} </b> </span>
                                    
                                        <Button variant="contained" onClick={()=>this.updateQty(row,-1)}> <RemoveIcon /> </Button> 

                                        &nbsp;&nbsp;
                                        <Button  onClick={()=>this.removeQty(row)}> Remove </Button> 
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                    ))}

                    <Grid item xs={12} sm={4}>
                          
                            <Grid direction="row" style={{ padding: "10px" }}>

                                    <Grid item xs={12} sm={12} style={{justifyContent:"space-between"}} >
                                    <Typography variant="h6" component="p" >
                                    PRICE DETAILS 
                                    </Typography>

                                    <Typography variant="h6" component="p" >
                                        Total ({this.state.cartList.length}Item)   : {this.state.totalPrice}
                                    </Typography>

                                    <Typography variant="h6" component="p" >
                                    Discount
                                    </Typography>
                                    <Typography variant="h6" component="p" >
                                    Delivery Charges

                                    </Typography>

                                    <Typography variant="h6" component="p" >
                                    <b>  Total Amount:  {this.state.totalPrice} </b>

                                    </Typography>

                                

                                    

                                </Grid>

                            </Grid>
                    </Grid>

                </Grid>

            </React.Fragment>
        );
    }
}

export default CartDetails;