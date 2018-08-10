import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './showStockPrice';
import registerServiceWorker from './registerServiceWorker';
import ReactEcharts from 'echarts-for-react';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker(); 
