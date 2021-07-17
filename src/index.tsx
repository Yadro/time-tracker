import React from 'react';
import { render } from 'react-dom';
import dotenv from 'dotenv';

import App from './App';
import { initSentry } from './shared/initSentry';
import './services/gaService/GaService';

dotenv.config();

initSentry();

render(<App />, document.getElementById('root'));
