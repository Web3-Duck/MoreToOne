import binanceLogo from '@/assets/binance.svg';
import ethLogo from '@/assets/eth.png';

import { ChainId } from './chainId';
import { RPC } from './rpc';

export interface NetInfoProp {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  image: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  customChainId: number;
}

export const networkConf = {
  [ChainId.BSCTestnet]: {
    chainId: 97,
    chainName: 'BSCTEST',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    image: binanceLogo,
    rpcUrls: [RPC[ChainId.BSCTestnet]],
  },
  [ChainId.Rinkeby]: {
    chainId: ChainId.Rinkeby,
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    image: ethLogo,
    rpcUrls: [RPC[ChainId.Rinkeby]],
  },
  [ChainId.Mainnet]: {
    chainId: ChainId.Mainnet,
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'ETH Token',
      symbol: 'ETH',
      decimals: 18,
    },
    image: ethLogo,
    rpcUrls: [RPC[ChainId.Mainnet]],
  },
  [ChainId.BSC]: {
    chainId: ChainId.BSC,
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18,
    },
    image: binanceLogo,
    rpcUrls: [RPC[ChainId.BSC]],
  },
};

export const getNetworkList = () => {
  const list = [];
  for (const item of Object.keys(networkConf)) {
    list.push(networkConf[item]);
  }
  return list;
};

export const networkList = getNetworkList();
