import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const appRoot = document.getElementById('root');

if (!appRoot) {
  throw new Error('App root not found');
}

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
