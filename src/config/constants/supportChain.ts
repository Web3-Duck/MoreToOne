import binanceSvg from '@/assets/binance.svg';
import { RPC } from './rpc';

export const SCAN_ADDRESS = {
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};

export const bsc = {
  id: 56,
  name: 'BSC',
  network: 'BSC',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  iconUrl: binanceSvg,
  rpcUrls: {
    default: RPC[56],
    public: RPC[56],
  },
  blockExplorers: { default: { name: 'BSC', url: SCAN_ADDRESS[56] } },
};

export const bscTest = {
  id: 97,
  name: 'BSCTEST',
  network: 'BSCTEST',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  iconUrl: binanceSvg,
  rpcUrls: {
    default: RPC[97],
    public: RPC[97],
  },
  blockExplorers: { default: { name: 'BSC-TEST', url: SCAN_ADDRESS[97] } },
};
