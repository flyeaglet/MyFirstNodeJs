import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

var getOption = require( './getTest.js' )
console.log("call function")
var options =  {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'test']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line'
  }]
};
 
options = getOption.getList()

export default class Test extends PureComponent {
  
  render() {
    return (
      <ReactEcharts
        option={options}
        style={{ height: '350px', width: '100%' }}
        className='react_for_echarts' />
    );
  }
}

