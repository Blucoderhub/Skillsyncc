// Options entry point

import React from 'react';
import { createRoot } from 'react-dom/client';
import OptionsComponent from './Options';
import '../styles/globals.css';

const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <OptionsComponent />
    </React.StrictMode>
  );
}
