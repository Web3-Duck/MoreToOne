import { ChainId } from '@/config/constants/chainId';
import { Token } from '@/config/constants/types';
type NativeMap = { [chainId: number]: Token };
export const NATIVE: NativeMap = {
  [ChainId.Mainnet]: {
    name: 'ETH Token',
    symbol: 'ETH',
    address: '',
    chainId: ChainId.Mainnet,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
  },
  [ChainId.BSC]: {
    name: 'BNB Token',
    symbol: 'BNB',
    address: '',
    chainId: ChainId.BSC,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
  },
  [ChainId.Rinkeby]: {
    name: 'ETH Token',
    symbol: 'ETH',
    address: '',
    chainId: ChainId.Rinkeby,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
  },
  [ChainId.BSCTestnet]: {
    name: 'BNB Token',
    symbol: 'BNB',
    address: '',
    chainId: ChainId.BSCTestnet,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
  },
};

export const getNative = (chainId) => {
  return NATIVE[chainId] ? NATIVE[chainId] : NATIVE[ChainId.Rinkeby];
};
