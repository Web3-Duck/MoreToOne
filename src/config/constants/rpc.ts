import { ChainId } from './chainId';

export const RPC = {
  [ChainId.Mainnet]: `https://rpc.ankr.com/eth`,
  [ChainId.BSC]: 'https://rpc.ankr.com/bsc',
  [ChainId.Rinkeby]: `https://rpc.ankr.com/eth_rinkeby`,
  [ChainId.BSCTestnet]: 'https://rpc.ankr.com/bsc_testnet_chapel',
};
