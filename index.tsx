import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
const loadingElement = document.getElementById('loading');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Hide loading text if render starts successfully
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
} catch (err) {
  console.error("Mounting error:", err);
  if (loadingElement) {
    loadingElement.innerText = "Failed to mount application.";
    loadingElement.style.color = 'red';
  }
}