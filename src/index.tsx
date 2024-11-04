import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { secureLogger } from './utils/secureLogger';

try {
  Amplify.configure(awsExports);
  secureLogger.log('Amplify configured successfully');
} catch (error) {
  secureLogger.error('Failed to configure Amplify:', error);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  secureLogger.log('Web Vital:', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating
  });
});
