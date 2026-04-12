import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { cloudConfig } from '@/shared/config/cloud';

async function bootstrap() {
  if (cloudConfig.features.useMsw) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
    // eslint-disable-next-line no-console
    console.info(
      `%c[MSW] Mock API active @ ${cloudConfig.apiUrl}`,
      'color:#7AA5E0;font-weight:bold',
    );
  }

  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('Missing #root element');

  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
