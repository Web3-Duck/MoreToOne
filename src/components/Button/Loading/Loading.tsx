import React from 'react';
import loading from '@/assets/img/loading.png';
import { Box } from '@mui/material';

interface LoadingProps {
  width?: string;
  margin?: string;
  icon?: string;
}

export const Loading = ({ width = '30px', margin, icon }: LoadingProps) => {
  return (
    <Box
      component="img"
      src={icon ? icon : loading}
      margin={margin}
      sx={{
        height: width,
        width: width,
        transform: 'rotate(360deg)',
        animation: 'mymove linear 2s infinite',
      }}
    ></Box>
  );
};
