import * as React from 'react';
import UserService from '../service/UserService';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select } from '@mui/material';

export default function PolicySelect({ policies, setPolicyName }) {
    const [policy, setPolicy] = React.useState('');
    //const [policies, setPolicies] = React.useState(localStorage.getItem("policies") && JSON.parse(localStorage.getItem("policies")));
  
    // React.useEffect(() => {
    //   console.log("hccycleName", hccycleName);
    //   let policiesList = localStorage.getItem("policies") ? JSON.parse(localStorage.getItem("policies")) : []; 
    //   setPolicies(policiesList)
  
    // }, [hccycleName]);
    const handleChange = (event) => {
      setPolicy(event.target.value)
      setPolicyName(event.target.value);
    };
  
    return (
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Policy</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={policy}
          title="Health Check cycles"
          label="Policy"
          onChange={handleChange}
        >

          {policies?.length ? policies?.map((item, i) => {
            return (
              <MenuItem value={item}>{item}</MenuItem>
            );
          }) : ""}

        </Select>
      </FormControl>
    );
  }
  