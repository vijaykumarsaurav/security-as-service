import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import HistoryIcon from '@material-ui/icons/History';

import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import LogoutComponent from './login/LogoutComponent'; 
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const AdminMenuList = (
  <div>
    {/* <ListSubheader inset>Upload & Create</ListSubheader> */}
   

    {/* <ListItem button component='a' href={"#/welcome"} >  
      <ListItemIcon>
        <EmojiEmotionsIcon />
      </ListItemIcon>
      <ListItemText primary="Welcome" />
    </ListItem> */}

    <ListItem button component='a' href={"#/user-re-registration"} >  
      <ListItemIcon>
      <VerifiedUserIcon />
      </ListItemIcon>
      <ListItemText primary="Diy Prepaid Activation" />
    </ListItem>

  
  </div>
);

export const LogoutMenu = (
  <div>
   <LogoutComponent/>
  </div>
);
