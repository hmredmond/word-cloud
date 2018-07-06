import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './assets/style/index.css';
import './assets/style/Splitpane.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
