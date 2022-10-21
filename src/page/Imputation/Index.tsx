import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Token } from '@/config/constants/types';
import { isAddressSimple, shortAccount } from '@/utils/address';
import bep20Abi from '@/config/abi/erc20.json';
import { useNetwork } from 'wagmi';
import defaultChainId from '@/config/constants/defaultChainId';
import { DangerButton, PrimaryButton } from '@/components/Button/Button';
import Row from '@/components/Row';
import toast from 'react-hot-toast';
import loadingIcon from '@/assets/img/loading.png';
import { Input, Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Switch } from '@mui/material';
import PrivateKeyDialog from './PrivateKeyDialog';
import { BigNumber, ethers, Wallet } from 'ethers';
import { Contract, Provider } from 'ethers-multicall';
import { accMul, accSub, formatAmount, parseAmount, toFixed } from '@/utils/formatBalance';
import { handleError } from '@/utils/error';
import { Loading } from '@/components/Button/Loading/Loading';
import { networkList } from '@/config/constants/network';
import { RPC } from '@/config/constants/rpc';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectTokenDialog from './SelectTokenDialog';
interface TableInfo {
  nativeBalance: string;
  tokenBalance: string;
  status: string;
  error: string;
  address: string;
  privateKey: string;
}

const rpcInfoList = networkList.map((item) => {
  return { rpcUrl: item.rpcUrls[0], chainName: item.chainName, chainId: item.chainId };
});

const Imputation = () => {
  const { chain = { id: defaultChainId } } = useNetwork();
  const [privateKeyOpen, setPrivateKeyOpen] = useState(false);
  const [selectTokenOpen, setSelectTokenOpen] = useState(false);
  const [recipient, setRecipient] = useState(''); //接收地址
  const [sendAmount, setSendAmount] = useState<string>('0'); //发送数量
  const [sendAll, setSendAll] = useState<boolean>(true); //发送数量
  const [rpcUrl, setRpcUrl] = useState(RPC[defaultChainId]);
  const [token, setToken] = useState<Token>({ address: '', name: '', symbol: '', decimals: 18, chainId: chain.id });
  const [tableList, setTableList] = useState<TableInfo[]>([]);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false); //发送Loading

  const provider = useMemo(() => {
    return new ethers.providers.JsonRpcProvider(rpcUrl);
  }, [rpcUrl]);

  const handlePrivateKeyOepn = () => {
    setPrivateKeyOpen(true);
  };

  const handlePrivateKeyClose = () => {
    setPrivateKeyOpen(false);
  };

  const handleSelectTokenOepn = () => {
    setSelectTokenOpen(true);
  };

  const handleSelectTokenClose = () => {
    setSelectTokenOpen(false);
  };

  const handleWalletList = (walletList: ethers.Wallet[]) => {
    const list = walletList.map((wallet) => {
      return { status: '', error: '', nativeBalance: '', tokenBalance: '', address: wallet.address, privateKey: wallet.privateKey };
    });
    setTableList(list);
  };

  const handleSelectToken = (token: Token) => {
    setToken(token);
  };

  const handleSend = async () => {
    setSendLoading(true);
    let copyTableList = JSON.parse(JSON.stringify(tableList));

    const gasPrice = await provider.getGasPrice();

    for (let i = 0; i < copyTableList.length; i++) {
      const item = tableList[i];
      try {
        copyTableList[i].status = '0';
        setTableList(copyTableList);
        // native token send
        if (!token.address) {
          const gas = accMul(gasPrice.toString(), 21000);
          const allAmount = sendAll ? accSub(item.nativeBalance, gas) : parseAmount(sendAmount);
          const nonce = await provider.getTransactionCount(item.address);
          const transaction = {
            nonce: nonce,
            gasLimit: 21000,
            gasPrice: gasPrice,
            to: recipient,
            value: BigNumber.from(allAmount),
            data: '0x',
          };
          const wallet = new ethers.Wallet(item.privateKey, provider);
          const result = await wallet.sendTransaction(transaction);
          await result.wait();
          copyTableList[i].status = '1';
          setTableList(copyTableList);
        } else {
          const tokenContract = new ethers.Contract(token.address, bep20Abi, provider);
          const allAmount = sendAll ? item.tokenBalance : parseAmount(sendAmount, token?.decimals);
          const gas = await tokenContract.estimateGas.transfer(recipient, allAmount, { from: item.address });
          const encodeData = tokenContract.interface.encodeFunctionData('transfer', [recipient, allAmount]);
          const nonce = await provider.getTransactionCount(item.address);
          const transaction = {
            nonce: nonce,
            gasLimit: BigNumber.from(toFixed(accMul(gas.toString(), 1.1), 0)),
            to: token.address,
            value: '0x',
            data: encodeData,
            gasPrice: gasPrice,
          };
          const wallet = new ethers.Wallet(item.privateKey, provider);
          const result = await wallet.sendTransaction(transaction);
          await result.wait();
          copyTableList[i].status = '1';
          setTableList(copyTableList);
        }
      } catch (e) {
        console.log(e, 'e');
        const message = handleError(e);
        copyTableList[i].status = '2';
        copyTableList[i].error = message;
        setTableList(copyTableList);
      }
      copyTableList = JSON.parse(JSON.stringify(copyTableList));
    }
    setSendLoading(false);
  };

  const handleGetTokenBalance = async () => {
    if (!tableList.length) {
      toast.error('请添加账户');
      return;
    }

    if (!token.name) {
      toast.error('请选择代币');
      return;
    }
    if (!provider) {
      toast.error('请选择网络');
      return;
    }
    try {
      setBalanceLoading(true);
      const ethcallProvider = new Provider(provider);
      await ethcallProvider.init();
      const p1 = tableList.map((item) => {
        return ethcallProvider.getEthBalance(item.address);
      });
      const nativeBalanceResult = await ethcallProvider.all(p1);
      if (!token.address) {
        const copyTableList = tableList.map((item, index) => {
          const balance = nativeBalanceResult[index].toString();
          return {
            ...item,
            nativeBalance: balance,
            tokenBalance: balance,
          };
        });
        setTableList(copyTableList);
      } else {
        const tokenContract = new Contract(token.address, bep20Abi);
        const p2 = tableList.map((item) => {
          return tokenContract.balanceOf(item.address);
        });
        const tokenBalanceResult = await ethcallProvider.all(p2);
        const copyTableList = tableList.map((item, index) => {
          return {
            ...item,
            nativeBalance: nativeBalanceResult[index].toString(),
            tokenBalance: tokenBalanceResult[index].toString(),
          };
        });
        setTableList(copyTableList);
      }
      setBalanceLoading(false);
    } catch (e) {
      setBalanceLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setRpcUrl(event.target.value as string);
  };
  return (
    <Paper
      sx={{
        margin: '20px auto 0',
        maxWidth: '900px',
        padding: '30px 20px',
        width: '90%',
      }}
    >
      <Box>
        <PrimaryButton onClick={handlePrivateKeyOepn}>设置待归集账号</PrimaryButton>
        <TableContainer sx={{ maxHeight: 440, minHeight: 200 }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell width="250px">钱包地址</TableCell>
                <TableCell align="left" width="120px">
                  平台币余额
                </TableCell>
                <TableCell align="left" width="120px">
                  代币余额
                </TableCell>
                <TableCell align="left" width="80px">
                  状态
                </TableCell>
                <TableCell align="center">错误信息</TableCell>
                <TableCell align="center" width="80px">
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableList.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left" sx={{ overflow: 'hidden' }}>
                    {shortAccount(row.address, 15, 13)}
                  </TableCell>
                  <TableCell align="left">{toFixed(formatAmount(row.nativeBalance), 4)}</TableCell>
                  <TableCell align="left">{toFixed(formatAmount(row.tokenBalance, token?.decimals), 4)}</TableCell>
                  <TableCell align="left" width="80px">
                    {row.status === '0' && <Loading width="25px" icon={loadingIcon}></Loading>}
                    {row.status === '1' && <Box sx={{ color: 'green' }}>成功</Box>}
                    {row.status === '2' && <Box sx={{ color: 'red' }}>失败</Box>}
                  </TableCell>

                  <TableCell align="left" sx={{ color: 'red' }}>
                    {row.error}
                  </TableCell>
                  <TableCell align="left">
                    <DangerButton
                      sx={{ fontSize: '13px' }}
                      onClick={() => {
                        const _tableList = [...tableList];
                        _tableList.splice(index, 1);
                        setTableList(_tableList);
                      }}
                    >
                      移除
                    </DangerButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {tableList.length === 0 && <Box sx={{ textAlign: 'center', width: '100%', padding: '20px', opacity: 0.5 }}>暂无账号数据</Box>}
        </TableContainer>
        <Row>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">选择网络</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={rpcUrl} label="选择网络" onChange={handleChange}>
              {rpcInfoList.map((item) => {
                return (
                  <MenuItem value={item.rpcUrl} key={item.rpcUrl}>
                    {item.chainName}-{item.rpcUrl}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Row>

        <Row sx={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            sx={{ marginRight: '20px' }}
            label="代币"
            variant="outlined"
            value={`${token.symbol}-${token.address ? token.address : token.name}`}
            disabled
          />
          <PrimaryButton
            sx={{ width: '120px', marginRight: '15px' }}
            onClick={() => {
              handleSelectTokenOepn();
            }}
          >
            设置代币
          </PrimaryButton>
          <PrimaryButton
            sx={{ width: '120px' }}
            loading={balanceLoading}
            onClick={() => {
              handleGetTokenBalance();
            }}
          >
            查询余额
          </PrimaryButton>
        </Row>
        <TextField
          sx={{ marginTop: '15px' }}
          fullWidth
          label="接收地址"
          variant="outlined"
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value);
          }}
          error={!!(recipient && !isAddressSimple(recipient))}
          helperText={recipient && !isAddressSimple(recipient) && 'Incorrect entry.'}
        />
        <Box sx={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ marginRight: '10px' }}>全部数量</Box>
            <Switch
              checked={sendAll}
              onChange={(event) => {
                setSendAll(event.target.checked);
              }}
            />
          </Box>
          <Box sx={{ margin: '0 20px' }}>或者</Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ marginRight: '10px' }}>发送数量</Box>
            <TextField
              sx={{ marginTop: '15px' }}
              label="发送数量"
              variant="outlined"
              value={sendAmount}
              disabled={sendAll}
              onChange={(e) => {
                setSendAmount(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton sx={{ width: '30%', marginTop: '30px' }} onClick={handleSend} loading={sendLoading}>
            发送
          </PrimaryButton>
        </Box>
      </Box>
      <PrivateKeyDialog open={privateKeyOpen} handleClose={handlePrivateKeyClose} handleWalletList={handleWalletList}></PrivateKeyDialog>
      <SelectTokenDialog
        open={selectTokenOpen}
        handleClose={handleSelectTokenClose}
        handleSelectToken={handleSelectToken}
        provider={provider}
      ></SelectTokenDialog>
    </Paper>
  );
};
export default Imputation;
