import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import HeaderNavbar from '../HeaderNavbar'
//import rows from './Reports.json'; 
import UserService from '../service/UserService';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandHosts from './ExpandHosts'
import ItemsDialog from './ItemsDialog';
import PolicySelectList from './PolicySelectList';
import moment from 'moment';
import './ScannedReports.css';
import { Button, TextField } from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import ApplyFilter from './ApplyFilter';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'check_section',
    numeric: false,
    disablePadding: true,
    label: 'Check Section',
  },
  {
    id: 'severity',
    numeric: true,
    disablePadding: false,
    label: 'Severity',
  },
  {
    id: 'check_description',
    numeric: true,
    disablePadding: false,
    label: 'Check Description',
  },
  {
    id: 'hostname',
    numeric: true,
    disablePadding: false,
    label: 'Hostname',
  },

  {
    id: 'check_status',
    numeric: true,
    disablePadding: false,
    label: 'Check status',
  },
  {
    id: 'ip',
    numeric: true,
    disablePadding: false,
    label: 'IP address',
  },
  {
    id: 'scan_date',
    numeric: true,
    disablePadding: false,
    label: 'Scan Date',
  },

  {
    id: 'violation',
    numeric: true,
    disablePadding: false,
    label: 'Violation',
  },
  {
    id: 'measure_values',
    numeric: true,
    disablePadding: false,
    label: 'Measure Values',
  }, 
  {
    id: 'policy_parameters',
    numeric: true,
    disablePadding: false,
    label: 'Policy Parameters',
  }  
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, isFilterEnable, handleFilter } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell, i) => (
          <TableCell
            key={headCell.id}
            style={{fontWeight: "bold"}}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
           
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
            {isFilterEnable ? <input onChange={handleFilter} name={headCell.id} /> : ""}  
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, setIsFilterEnable, globalSearchText, setGlobalSearchText,rowsLength } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
          //color={'primary'}
        >
          Reports({rowsLength}) <PolicySelectList />
           <TextField 
            style={{width:'50%'}}
            variant="standard"
            label="Global Search"
            value={globalSearchText}
            placeholder="Search in check section, desc, ip and violation"
            onChange={(e) => setGlobalSearchText(e.target.value)}
           />
        </Typography>
      )}

      {numSelected > 0 ? (
        <span> 
          {/* <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon/> 
        </IconButton>
      </Tooltip> */}
        <Tooltip title="Approve">
        <IconButton>
          <DoneIcon/> 
        </IconButton>
      </Tooltip> 
      </span>
      ) : (
        <Tooltip title="Filter list">
           <ApplyFilter setIsFilterEnable={setIsFilterEnable} />
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); 
  const [rows, setRows] = React.useState([]); 
  const [allRows, setAllRows] = React.useState([]); 
  
  const [rowsWait, setRowsWait] = React.useState(true); 
  const [isFilterEnable, setIsFilterEnable] = React.useState(true); 
  const [globalSearchText, setGlobalSearchText] = React.useState(''); 

  React.useEffect(() => {
    
    if(globalSearchText.length === 0){
      setRows(allRows);
    }else{
      let tempSearch = []; 
      
      allRows.forEach(element => {
        if(lowercase(element.check_section).includes(lowercase(globalSearchText)) || 
        lowercase(element.check_description).includes(lowercase(globalSearchText)) ||
        lowercase(element.hostname).includes(lowercase(globalSearchText)) ||
        lowercase(element.ip).includes(lowercase(globalSearchText)) ||
        lowercase(element.violation).includes(lowercase(globalSearchText))){
            tempSearch.push(element);
        }

        //let keys = Object.keys(element); 
        // for (let index = 0; index < keys.length; index++) {
        //   const key = keys[index];
        //  // let searchExp = /${globalSearchText}/i;
        //   console.log("keys", key, element[key])
        //   if(element[keys[index]].includes(globalSearchText)){
        //     tempSearch.push(element);
        //     break; 
        //   } 
        // }

        // keys.forEach(key => {
        //     let searchExp = /${globalSearchText}/i;
        //     console.log("keys", key, element[key])
        //     //searchExp.test(element[key])
        //     //        text.match(pattern);
        //     //element[key].includes(globalSearchText)
        //     if(element[key].includes(globalSearchText)){
        //       tempSearch.push(element);
        //       return; 
        //     }
        // });
  
        // if(Array.isArray(element)){
        // }else if(){
        // }
      });
      setRows(tempSearch);
    }

  
  }, [globalSearchText]);

  React.useEffect(()=> {
    UserService.getDeviations().then((results) => {
      if(results.status === 200){ 
        console.log("results", results.data);
        setRowsWait(false);
        duplicateDeviationsData(results.data);
      }
    }).catch((error)=> {
      console.log("error", error)
     // setRowsWait(false);
      alert("Error" + error);

    });

  }, []);

  const lowercase = (text) => {
    let str = text ? text.toLowerCase() : ""; 
    return str; 
  };

 const duplicateDeviationsData = (devData) => {
      let tempDevData = [];
      devData.forEach(element => {
          element.hosts.forEach(host => {
            element.hostname = host.hostname;
            element.check_status = host.check_status;
            element.ip = host.ip;
            element.scan_date = host.scan_date;
            
            if(host.violations.length > 0){
              host.violations.forEach(violation => {
                element.violation = violation.message;
                element.measure_values = host.measure_values;
                element.policy_parameters = host.policy_parameters;
                tempDevData.push(element); 
              })
            }else{
              element.violation = '';
              tempDevData.push(element); 
            }
            
          })
      });
      setAllRows(tempDevData);
      setRows(tempDevData);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleFilter = (e) => {
    let val = e.target.value; 
    let name = e.target.name; 
    let tempSearch = []; 

    console.log("filer", name, val)
   // let filterData = rows.filter(item => item[name].includes(val)); 

    if(val.length === 0){
      setRows(allRows);
    }else{
      rows.forEach(element => {
        if(element[name] && lowercase(element[name]).includes(lowercase(val)) ){
            tempSearch.push(element);
        }
      });
      setRows(tempSearch);
    }

   // setRows(filterData);
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <HeaderNavbar />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar rowsLength={rows.length} setGlobalSearchText={setGlobalSearchText} globalSearchText={globalSearchText} setIsFilterEnable={setIsFilterEnable} numSelected={selected.length} />

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              isFilterEnable={isFilterEnable}
              handleFilter={handleFilter}
            />
             {rowsWait  && (
                <TableRow>
                  <TableCell colSpan={4}>
                      <Typography> 
                         <CircularProgress />
                          {/* Loading data,  pls wait... */}
                      </Typography>  
                      </TableCell>
                </TableRow>
              )}
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.check_section + '_'+ index);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.check_section + '_'+ index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                         onClick={(event) => handleClick(event, row.check_section  + '_'+ index)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        title={row.check_section} 
                      >
                      {row.check_section.substring(0, 50)}
                      </TableCell>
                      <TableCell align="left">{row.severity}</TableCell>
                      <TableCell width={"400px"} align="left">{row.check_description}</TableCell>

                      <TableCell align="left">{row.hostname}</TableCell>
                      <TableCell align="left">{row.check_status}</TableCell>
                      <TableCell align="left">{row.ip}</TableCell>
                      <TableCell align="left">{moment(row.scan_date).format('DD-MMM-YYYY, hh:mm a')}</TableCell>

                      <TableCell align="left">
                        {row?.violation}
                      </TableCell>

                      <TableCell align="left">
                        {row?.measure_values?.length > 0 ?  <ItemsDialog items={row?.measure_values} title="Values"/>: ""}
                      </TableCell>

                      <TableCell align="left">
                      {row?.policy_parameters?.length > 0 ?  <ItemsDialog items={row?.policy_parameters} title="Parameters"/>: ""}

                      </TableCell>
                      
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                  
                </TableRow>
              )}
              
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
