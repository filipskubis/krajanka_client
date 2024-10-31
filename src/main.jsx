import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';

//contexts
import { AlertProvider } from './misc/AlertContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>
);
