import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Prevent cross-origin iframe DevTools SecurityError from breaking execution
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes("SecurityError") && event.message.includes("$$typeof")) {
    event.preventDefault();
    console.warn('Cross-origin frame inspection intercepted safely.');
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

