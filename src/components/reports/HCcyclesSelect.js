import * as React from 'react';
import UserService from '../service/UserService';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select } from '@mui/material';

export default function HCcyclesSelect({ hcrows, hccycleName, setHccycleName,setScanDate }) {
    const [healthCheckName, sethealthCheckName] = React.useState( hccycleName || '');
  
    // React.useEffect(() => {
    // //   localStorage.setItem("policies", JSON.stringify(policies));
    // //   localStorage.setItem("healthCheckName", healthCheckName);
    // }, [healthCheckName])
  
    const handleChange = (event) => {
      sethealthCheckName(event.target.value)
      setHccycleName(event.target.value)
      setScanDate('')
    };
  
    return (
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">HC cycles</InputLabel>
        <Select
       
          labelId="demo-select-small"
          id="demo-select-small"
          value={healthCheckName}
          title="Health Check cycles"
          label="HC cycles"
          onChange={handleChange}
        > 
          {hcrows.length ? hcrows?.map((item, i) => {
            return (
              <MenuItem value={item.name}>{item.name}</MenuItem>
            );
          }) : ""}
        </Select>
      </FormControl>
    );
  }