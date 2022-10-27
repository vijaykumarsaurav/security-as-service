import * as React from 'react';
import UserService from '../service/UserService';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Select } from '@mui/material';

export default function ScanDateSelect({scansRows}) {
    const [age, setAge] = React.useState('');  
   
    const handleChange = (event) => {
      setAge(event.target.value);
    };
  
    return (
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small">Scan Date</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={age}
          title="Health Check cycles"
          label="Scan Date"
          onChange={handleChange}
        >
            {scansRows?.length ? scansRows?.map((item, i) => {
            return (
              <MenuItem value={item.jobId}>{item.date}</MenuItem>
            );
          }) : ""}
          {/* <MenuItem value={'20220101(#2)'}>20220101(#2)</MenuItem>
          <MenuItem value={'20220102(#1)'}>20220102(#1)</MenuItem> */}
        </Select>
      </FormControl>
    );
  }