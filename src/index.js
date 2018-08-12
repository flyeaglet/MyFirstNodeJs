import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './showStockPrice';
import registerServiceWorker from './registerServiceWorker';
import ReactEcharts from 'echarts-for-react';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker(); 



/* 
import React from 'react';
import { render } from 'react-dom';
import Demo from './react-select';

const rootElement = document.querySelector('#root');
if (rootElement) {
  render(<Demo />, rootElement);
}
       */