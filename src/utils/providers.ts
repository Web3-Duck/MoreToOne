import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '@/config/constants/chainId';
import { RPC } from '@/config/constants/rpc';

const getRpcUrl = (chainId) => {
  return new StaticJsonRpcProvider(RPC[chainId] ? RPC[chainId] : RPC[ChainId.Rinkeby]);
};

export const simpleRpcProvider = getRpcUrl;

export default null;
