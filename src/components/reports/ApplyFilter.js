import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchLabels({ setIsFilterEnable }) {

  return (
    <FormGroup>
      <FormControlLabel onClick={(e) => {setIsFilterEnable(e.target.checked)}} control={<Switch  />} title="Apply Filter" label="Filter" />
    </FormGroup>
  );
}
