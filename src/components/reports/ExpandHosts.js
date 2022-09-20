import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ControlledAccordions(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  return (
    <div>
      <Accordion defaultExpanded={'false'} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        
      {props.hosts.map((host) => {
            return( 
            <div> 
            <span> </span>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Hostname: 
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{host.ip}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                Check Status: {host.check_status}<br/>
                IP Address: {host.ip}<br/>
                Scan Date: {host.scan_date}<br/>
                Violations: {host.violations.map( violation => violation)}<br/>
            </AccordionDetails>
            
            </div>



            ); 
        })}
        
        
      </Accordion>
    </div>
  );
}
