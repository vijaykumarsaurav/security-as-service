import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

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

export default function CustomizedDialogs(props) {

    console.log(props)

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size='small' title="Click to view the all hosts"  variant="outlined" onClick={handleClickOpen}>
                {props?.hosts?.length} Hosts
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Hosts Details
                </BootstrapDialogTitle>
                <DialogContent dividers>

                    {props?.hosts?.map((host) => {
                        return (
                            <div>
                                <b> Hostname: </b>  {host?.hostname} <br />
                                <b> Check Status: </b> {host?.check_status} <br />
                                <b>IP Address: </b>  {host?.ip}<br />
                                <b>  Scan Date:  </b> {host?.scan_date}<br />
                                <b> Violations:  </b>{host?.violations.map(violation => violation?.message)} <br /><br />
                            </div>
                        );
                    })}

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
