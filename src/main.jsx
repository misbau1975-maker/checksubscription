import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './SubscriptionLeakDetector.jsx';

// Reset default page background and margins so the app's own paper-cream
// canvas extends fullbleed.
const style = document.createElement('style');
style.textContent = `
  html, body { margin: 0; padding: 0; background: #f6f1e6; }
  * { box-sizing: border-box; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
