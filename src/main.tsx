import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { App } from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppSettingsProvider>
        <App />
      </AppSettingsProvider>
    </StrictMode>
  );
}
