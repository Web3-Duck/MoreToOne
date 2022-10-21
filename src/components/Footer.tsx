import React from 'react';
import wechat from '@/assets/wechat.png';
import rightArrow from '@/assets/icon/rightArrow.png';

import { Box, Paper } from '@mui/material';
import { RowBetween } from './Row';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
const LightTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export default function Footer() {
  return (
    <Paper
      sx={{
        width: '90%',
        background: '#fff',
        margin: '20px auto 0',
        maxWidth: '900px',
        padding: '20px 20px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LightTooltip
          placement="top-start"
          title={
            <React.Fragment>
              <Box style={{ width: '200px' }}>
                <img src={wechat} width="200px" alt="" />
              </Box>
            </React.Fragment>
          }
        >
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src={rightArrow} alt="" style={{ width: '50px', marginRight: '15px' }} />
            <Box> 有困难 找鸭头</Box>
          </Box>
        </LightTooltip>
      </Box>
    </Paper>
  );
}
