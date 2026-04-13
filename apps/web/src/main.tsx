import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import {
  init,
  mountThemeParams,
  mountMiniApp,
  bindThemeParamsCssVars,
  miniAppReady,
} from '@telegram-apps/sdk-react';
import App from './App';
import './styles/globals.css';
import { expandMiniApp } from './utils/telegram';

try {
  init();
  mountThemeParams();
  mountMiniApp();
  bindThemeParamsCssVars();
  miniAppReady();
} catch (e) {
  console.warn('Telegram SDK init (non-fatal outside Mini App):', e);
  window.Telegram?.WebApp?.ready();
}

expandMiniApp();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: '!bg-tg-secondary-bg !text-tg-text',
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
