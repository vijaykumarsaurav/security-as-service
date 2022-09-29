import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UserService from '../service/UserService';

export default function SelectSmall() {
  const [policyList, setPolicyList] = React.useState([]);
  const [policy, setPolicy] = React.useState('Windows-2019-ITSSCSD-2.9');

  const handleChange = (event) => {
    setPolicy(event.target.value);
  };
  
  React.useEffect(()=> {
    UserService.getPolicies().then((results) => {
      if(results.status === 200){ 
        console.log("results", results.data);
        setPolicyList(results.data);
      }
    }).catch((error)=> console.log("error", error));

  }, []);
  

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Select Policy</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={policy}
        label="Select Policy"
        size='small'
        onChange={handleChange}
      >
        {policyList.map(item=> {
            return (
                <MenuItem value={item.name}>{item.name}</MenuItem>
            )
        } )}

      </Select>
    </FormControl>
  );
}
