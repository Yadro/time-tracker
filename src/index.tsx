import React from 'react';
import { render } from 'react-dom';
require('dotenv').config();

import App from './App';
import { initSentry } from './shared/initSentry';

initSentry();

render(<App />, document.getElementById('root'));
