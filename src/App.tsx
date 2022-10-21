import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Header from '@/components/Header/Index';
import Footer from './components/Footer';
import Imputation from '@/page/Imputation/Index';
import { Toaster } from 'react-hot-toast';

import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets, RainbowKitProvider, wallet } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { bsc, bscTest } from '@/config/constants/supportChain';
import { Box } from '@mui/material';

const { chains, provider } = configureChains(
  [bsc, chain.mainnet, bscTest, chain.rinkeby],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: chain.rpcUrls.default };
      },
    }),
    publicProvider(),
  ]
);
const needsInjectedWalletFallback =
  typeof window !== 'undefined' && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet;

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains, shimDisconnect: true }),
      wallet.brave({ chains, shimDisconnect: true }),
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
      wallet.coinbase({ appName: 'Duck', chains }),
      ...(needsInjectedWalletFallback ? [wallet.injected({ chains, shimDisconnect: true })] : []),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
export default function APP() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Box className="App" sx={{ position: 'relative' }}>
          <Router>
            <Box>
              <Toaster></Toaster>
              <Header></Header>
              <Box sx={{ paddingTop: '100px' }}>
                <Switch>
                  <Route path="/" exact component={Imputation} />
                </Switch>
                <Footer></Footer>
              </Box>
            </Box>
          </Router>
        </Box>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
