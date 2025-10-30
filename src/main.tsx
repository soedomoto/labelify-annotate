import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import './main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

createRoot(document.querySelector('.app-wrapper')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
