import React, { useState } from 'react';
import { Box, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { MyConnectButton } from '@/components/Button/Button';
import more from '@/assets/icon/more.png';
import { RowBetween } from '../Row';
import { useHistory } from 'react-router-dom';

const menuList = [{ name: '归集代币', url: '/imputation' }];

export default function Header() {
  const history = useHistory();
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (menuItem: any) => {
    history.push(menuItem.url);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        background: '#F5DA4A',
        padding: '6px 16px',
        position: 'fixed',
        left: '0',
        top: 0,
        width: '100%',
        zIndex: 999,
      }}
    >
      <RowBetween>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img
              src="/imgaes/logo.png"
              onClick={() => {
                history.push('/');
              }}
              alt=""
              style={{ height: '48px', width: '48px' }}
            />
            {!downLg && (
              <Box
                sx={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginRight: '40px',
                }}
              >
                Duck&apos;s Life
              </Box>
            )}
          </Box>
          {!downLg && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuList.map((item, index) => {
                return (
                  <Box
                    sx={{
                      marginRight: '15px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleMenu(item);
                    }}
                    key={index}
                  >
                    {item.name}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MyConnectButton sx={{ height: '100%' }}></MyConnectButton>
          {downLg && <img src={more} onClick={handleClick} style={{ height: '32px', width: '32px' }}></img>}
        </Box>
      </RowBetween>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuList.map((item, index) => {
          return (
            <MenuItem
              onClick={() => {
                handleMenu(item);
              }}
              key={index}
            >
              {item.name}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
