import React, { useEffect, useMemo, useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField } from '@mui/material';
import { InfoButton, PrimaryButton } from '@/components/Button/Button';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import bep20Abi from '@/config/abi/erc20.json';
import { NATIVE } from '@/config/constants/native';
import { Token } from '@/config/constants/types';

const SelectTokenDialog = ({ open, handleClose, handleSelectToken, provider }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [value, setValue] = React.useState('native');
  const [loading, setLoading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const handleConfirm = async () => {
    try {
      setLoading(true);
      const { chainId } = await provider.getNetwork();
      let token: Token;
      if (value === 'native') {
        token = NATIVE[chainId];
      } else {
        const tokenContract = new ethers.Contract(tokenAddress, bep20Abi, provider);
        const { chainId } = await provider.getNetwork();
        const symbol = await tokenContract.symbol();
        const name = await tokenContract.name();
        const decimals = await tokenContract.decimals();
        token = { symbol, name, decimals: decimals.toString(), address: tokenAddress, chainId: chainId };
      }
      handleSelectToken(token);
      handleCloseDialog();
      toast.success(`代币设置成功`);
      setLoading(false);
    } catch (e) {
      toast.error('代币设置失败, 请检查合约地址');
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    handleClose();
    setTokenAddress('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '700px',
          width: '100%',
        },
      }}
    >
      <DialogTitle>代币设置</DialogTitle>
      <DialogContent>
        <FormControl>
          <FormLabel>代币类型</FormLabel>
          <RadioGroup row name="row-radio-buttons-group" value={value} onChange={handleChange}>
            <FormControlLabel value="native" control={<Radio />} label="Native Token" />
            <FormControlLabel value="erc20" control={<Radio />} label="ERC20 Token" />
          </RadioGroup>
        </FormControl>
        {value === 'erc20' && (
          <TextField
            label="请输入token地址"
            sx={{ marginTop: '20px' }}
            fullWidth
            placeholder="请输入token地址"
            value={tokenAddress}
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <InfoButton onClick={handleCloseDialog}>取消</InfoButton>
        <PrimaryButton onClick={handleConfirm} loading={loading}>
          确定
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default SelectTokenDialog;
