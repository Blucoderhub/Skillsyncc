// Popup entry point

import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupComponent from './Popup';
import '../styles/globals.css';

const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <PopupComponent />
    </React.StrictMode>
  );
}
