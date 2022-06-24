import React from 'react';

// Due to issue with antd, we need to use old react api
import { render } from 'react-dom';
// FIXME: import { createRoot } from 'react-dom/client';

import dotenv from 'dotenv';

import App from './App';
import { initSentry } from './shared/initSentry';
import './services/gaService/GaService';

dotenv.config();

initSentry();

render(<App />, document.getElementById('root'));
// createRoot(document.getElementById('root')).render(<App />);
