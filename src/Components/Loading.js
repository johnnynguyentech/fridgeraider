import React from 'react';
import './styles.css';
import { Typography } from '@mui/material';

const Loading = () => {
  return (
    <div className="loading-widget">
      <div className="spinner"></div>
      <Typography className="poppins-bold" variant="h5" sx={{ color: "secondary.main", fontWeight: "600", pt: 3}}>Hold tight! Our chefs are building your recipe.</Typography>
    </div>
  );
};

export default Loading;
