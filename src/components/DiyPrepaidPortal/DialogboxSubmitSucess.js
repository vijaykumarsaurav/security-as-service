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
    localStorage.clear();

    window.location.replace('#/');

    setOpen(false);
  };



  return (
    <div>
      <Button  style={{display:"none"}} variant="outlined"  id="showPopupSuccess" color="primary" onClick={handleClickOpen}>
        Open
      </Button>

      <Dialog   
        disableBackdropClick={true}
        disableEscapeKeyDown={true} 
        onClose={handleClose} 
        aria-labelledby="customized-dialog-title" 
        open={open}
        >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Airtel DIY Activation
        </DialogTitle>
        
        <DialogContent dividers>
         
          <Typography style={{fontSize: 'large'}} gutterBottom color="primary">

          Thank you for submitting your details for DIY Activation of your airtel connection <b> {localStorage.getItem('activationNumber')} </b> 
          You will get a confirmation  via SMS upon confirmation.

          <br /> <br />
          ස්තූතියි. ඔබගේ දුරකථන සම්බන්ධතාවය නැවත ලියාපදිංචි කිරීම සඳහා ඔබේ තොරතුරු ඉදිරිපත් කර ඇත. තහවුරු කිරීමෙන් පසු ඔබට කෙටි පණිවුඩයක් මගින් දැනුම් දෙනු ඇත.

          <br /> <br />
          நன்றி. உங்கள் தொலைபேசி இணைப்பை மீள் பதிவு செய்ய உங்களுடைய தகவல்கள் சமர்ப்பிக்கப்பட்டுள்ளன. உறுதிப்படுத்திய பின் SMS  மூலம் உங்களுக்கு அறிவிக்கப்படும்.
          </Typography>
         
        </DialogContent>
        <DialogActions>
         
          <Button variant="contained" onClick={handleClose}>
          Close 
          ඉවත්වන්න

          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
