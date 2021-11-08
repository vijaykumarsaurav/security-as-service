import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import UserService from "../service/UserService";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs1( props ) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  

  const handleClose = () => {
  
    UserService.logout()
        .then(res => {
        localStorage.clear();
        window.location.reload();
        return;
    });
   
  };

  const proccedToUpload = () => {
    
     window.location.replace('#/user-re-registration');
     setOpen(false);
   };

  return (
    <div>
      <Button style={{display:'none'}} variant="outlined"  id="showPopupRejected" color="primary" onClick={handleClickOpen}>
        Open dialog
      </Button>
      <Dialog   
        disableBackdropClick={true}
        disableEscapeKeyDown={true} 
        onClose={handleClose} 
        aria-labelledby="customized-dialog-title" 
        open={open}
        >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
         Re-Registration Status
        </DialogTitle>
        
        <DialogContent dividers>
         
          <Typography gutterBottom>         
   
          Your documents have been <span style={{color:'red'}}>Rejected</span>. Please upload the new documents. <br /><br />

          ඔබේ නැවත ලියාපදිංචි ඉල්ලීම <span style={{color:'red'}}>ප්‍රතික්ෂේප</span> කර ඇත. කරුණාකර නැවත තොරතුරු ඇතුළත් කරන්න.<br /><br />

          உங்களுடைய தகவல்கள் <span style={{color:'red'}}>நிராகரிக்கப்பட்டுள்ளன</span>. தயவுசெய்து தகவல்களை மீண்டும் உள்ளிடவும்.

          </Typography>
         
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Cancel
          </Button>

          <Button variant="contained" onClick={proccedToUpload} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
