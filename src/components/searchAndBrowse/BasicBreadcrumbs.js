import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function handleClick(event) {
  //event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BasicBreadcrumbs(props) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="#/homepage">
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="#/homepage"
        >
          Categories
        </Link>
        {/* <Link underline="hover" color="inherit" href= {"#/product-category?q=" + props.query}>
          Categories Product
        </Link> */}
      </Breadcrumbs>
    </div>
  );
}