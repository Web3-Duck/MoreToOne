import React, { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField } from '@mui/material';
import { InfoButton, PrimaryButton } from '@/components/Button/Button';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
const PrivateKeyDialog = ({ open, handleClose, handleWalletList }) => {
  const [keyInput, setKeyInput] = useState('');
  const handleConfirm = () => {
    const keyList = keyInput.split('\n');
    try {
      const walletList = keyList.map((privateKey) => {
        return new ethers.Wallet(privateKey);
      });
      console.log(walletList, 'walletList');

      handleWalletList(walletList);
      handleCloseDialog();
    } catch (e) {
      toast.error('私钥有错误 请检查');
    }
  };

  const handleCloseDialog = () => {
    handleClose();
    setKeyInput('');
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
      <DialogTitle>私钥导入</DialogTitle>
      <DialogContent>
        <Box sx={{ fontSize: '14px' }}>一行一个</Box>
        <TextField
          multiline
          fullWidth
          hiddenLabel
          variant="filled"
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#f4f4f5',
            },
            '& .MuiInputBase-input.MuiFilledInput-input': {
              fontSize: '14px',
              background: 'transparent',
              color: '#13110d',
            },
          }}
          value={keyInput}
          onChange={(e) => {
            setKeyInput(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <InfoButton onClick={handleCloseDialog}>取消</InfoButton>
        <PrimaryButton onClick={handleConfirm}>确定</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default PrivateKeyDialog;
