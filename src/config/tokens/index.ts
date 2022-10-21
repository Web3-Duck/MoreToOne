import rinkeby from './rinkeby.json';
import bscTestnet from './bsc-testnet.json';
import bsc from './bsc.json';
import mainnet from './mainnet.json';

import { ChainId } from '../constants/chainId';
import { Token } from '@/config/constants/types';

type TokenList = { [chainId: number]: Token[] };

const TOKENLIST: TokenList = {
  [ChainId.Mainnet]: mainnet,
  [ChainId.BSC]: bsc,
  [ChainId.Rinkeby]: rinkeby,
  [ChainId.BSCTestnet]: bscTestnet,
};

export default TOKENLIST;
