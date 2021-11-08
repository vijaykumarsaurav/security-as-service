import { HashRouter as Router, Route, Switch} from 'react-router-dom'
import React from "react";
import Homepage from './searchAndBrowse/Homepage';
import ProductCategory from './searchAndBrowse/ProductCategory';
import ProductDetails from './searchAndBrowse/ProductDetails';
import CartList from './searchAndBrowse/CartList';


const AppRouter = () => {

    return(
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/" exact component={Homepage}/>
                    <Route path="/product-category" component={ProductCategory}/>
                    <Route path="/product-details" component={ProductDetails}/>
                    <Route path="/cart" component={CartList}/>

                    <Route path="*" component={Homepage} />
                     
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default AppRouter;