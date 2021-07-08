import React from 'react';
import { render } from 'react-dom';
require('dotenv').config();

import App from './App';
import { initSentry } from './shared/initSentry';
import './services/GaService';

initSentry();

render(<App />, document.getElementById('root'));
