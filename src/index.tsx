import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const wallets = [new PetraWallet()];

root.render(
  <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AptosWalletAdapterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
