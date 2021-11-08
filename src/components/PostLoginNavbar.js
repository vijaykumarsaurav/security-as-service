import React from 'react';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { textAlign } from '@material-ui/system';
import * as Menu from './LeftMenuBar';
import AirtellLogo from './airtellogo.png';

import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import {resolveResponse} from "../utils/ResponseHandler";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    endMenu: {
        display: 'flex',
        flexDirection: 'row reverse'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        //backgroundColor: '#f44336'
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default function PostLoginNavBar(props) {

    const [values, setValues] = React.useState({
        acquisitionCount: '',
        resubmitCount:'',
        oneSpace: false
    });
    


    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    function handleDrawerOpen() {
        console.log('clicked')
        setValues({ oneSpace : true  });
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
        setValues({ oneSpace : false  });
    }

    function handleClick(e) {
        console.log(e.target.innerText)
        //this.props.history.push('/login');
    }
  
    const style = {
        flexGrow: 1,
        fontSize: '17px', 
        marginTop: '6px'
    }
   
    

    var userDetails = localStorage.getItem("userDetails")
    userDetails = userDetails && JSON.parse(userDetails);
     
    var roleCode = userDetails && userDetails.roleCode; 
    // if(roleCode == "DE" || roleCode == "BOA"){
    //     if(localStorage.getItem("recordToProccedFirstTime") === 'yes'){
    //         ActivationService.getTotalToBeProcessed().then(res => {
    //             let data = resolveResponse(res);
    //            // localStorage.setItem("acquisitionCount",data.result && data.result.acquisitionCount ); 
    //            // localStorage.setItem("resubmitCount",data.result && data.result.resubmitCount ); 
             
    //            if(data.result && data.result.acquisitionCount && data.result.resubmitCount){
    //                 setValues({ ...values, ['acquisitionCount']: "Acquisition records to be processed: " + data.result.acquisitionCount, ['resubmitCount']: "Resubmit records to be processed: "+ data.result.resubmitCount });
    //                 window.localStorage.setItem("recordToProccedFirstTime",'no');
    //             }
    //         })
    //     }
    // 
  


    return (

        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}

            >
                <Toolbar>

                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}

                    >
                        <MenuIcon />
                    </IconButton>

                        <Grid justify="left" container direction="row">
                            <Grid item xs={12} sm={1}>
                                <img  style={{width:"110px", marginTop: '3px'}} src={AirtellLogo} />
                            </Grid>
                            <Grid item  xs={12} sm={9} style={{textAlign: 'left'}}>
                                <Typography variant="h6" style={style}>
                                {values.oneSpace ? <span> &nbsp; </span> : ""}  &nbsp; Airtel DIY Activation
                                </Typography>
                            </Grid>

                            <Grid item  xs={12} sm={2} style={{textAlign: 'end'}}>
                                    <Typography variant="h6" style={style}>
                                   Sim Ref: {localStorage.getItem('simRefNumber')}
                                </Typography> 
                            </Grid>

                        </Grid>

                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    {/* <img style={{ marginRight: "73px", width: "100px" }} src={AirtellLogo} /> */}

                    {/* <img width="40" style={{ color: "red", marginRight:"130px"}} src={ 'https://www.pinclipart.com/picdir/middle/498-4988102_36-53k-airtel-logos-of-indian-companies-quiz.png'} /> */}

                    <IconButton onClick={handleDrawerClose}  >
                        {theme.direction === 'ltr' ? <ChevronLeftIcon style={{ color: "gray" }} /> : <ChevronRightIcon style={{ color: "gray" }} />}
                    </IconButton>
                </div>



                <Divider />
                <List>{Menu.AdminMenuList}</List>
           

                <Divider />
                <List>{Menu.LogoutMenu}</List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
            </main>
        </div>
    );
}


// BO agent : BOA
// Data Entry : DE
// Admin : ADMIN
// Distributor : DIST

