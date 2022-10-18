import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ExpandListItem from './ExpandListItem';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({ items, title }) {


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        console.log('ItemsDialog', items, title, 'open', open );

        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size='small' title="Click to view the all"  variant="outlined" onClick={handleClickOpen}>
                {items?.length} {title}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title === "Values" ? "Measure Values" : "Policy Parameters"}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Paper style={{padding:'10px'}}> 
                    {items?.map((item, i) => {
                        return (
                            <span><span>{i+1}. {item}</span><br /></span> 
                        );
                    })}
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Okey
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}