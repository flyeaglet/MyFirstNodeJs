import React, { Component } from 'react'
import './App.css'
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'

var instance = axios.create({
  baseURL: 'http://59.126.125.77:8000'
});
var line_chart_list = {
  xAxis: {
    type: 'category',
    data: ['default']
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 500,
  },
  series: [{
    data: [0],
    type: 'line',
    smooth: true
  }]
};
var stock_no;
var list_type = "1_month";

class App extends Component {
  constructor() {
    super()
    this.state = {
      username: JSON.stringify(line_chart_list),
      options: line_chart_list,
      stock_no: "",
      list_type: "1_month"
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange_no(event) {
    // event.target 是當前的 DOM elment
    // 從 event.target.value 取得 user 剛輸入的值
    // 將 user 輸入的值更新回 state
    stock_no = event.target.value;
    console.log(stock_no);
  }

  handleChange_type(event) {
    // event.target 是當前的 DOM elment
    // 從 event.target.value 取得 user 剛輸入的值
    // 將 user 輸入的值更新回 state
    list_type = event.target.value;
  }

  handleClick() {
    console.log("no:" + stock_no);
    console.log("type:" + list_type);
    //抓取當天日期
    var s_time_src = new Date();
    var e_time_src = new Date();
    var year;
    var month;
    var day;

    //依據類型扣年月
    switch (list_type) {
      case "1_month":
        s_time_src.setMonth(s_time_src.getMonth() - 1);
        break;
      case "3_month":
        s_time_src.setMonth(s_time_src.getMonth() - 3);
        break;
      case "6_mounth":
        s_time_src.setMonth(s_time_src.getMonth() - 6);
        break;
      case "1_year":
        s_time_src.setYear(s_time_src.getYear() - 1);
        break;
      case "3_year":
        s_time_src.setYear(s_time_src.getYear() - 3);
        break;
      case "all_year":
        s_time_src.setYear(s_time_src.getYear() - 100);
        break;
    }

    //取年
    year = e_time_src.getFullYear()
    //取月
    if ((e_time_src.getMonth() + 1) < 10)
      month = "0" + (e_time_src.getMonth() + 1)
    else
      month = "" + (e_time_src.getMonth() + 1)
    //取日
    if (e_time_src.getDate() < 10)
      day = "0" + e_time_src.getDate()
    else
      day = "" + e_time_src.getDate()

    var e_time = year + "-" + month + "-" + day

    //取年
    year = s_time_src.getFullYear()
    //取月
    if ((s_time_src.getMonth() + 1) < 10)
      month = "0" + (s_time_src.getMonth() + 1)
    else
      month = "" + (s_time_src.getMonth() + 1)
    //取日
    if (s_time_src.getDate() < 10)
      day = "0" + s_time_src.getDate()
    else
      day = "" + s_time_src.getDate()

    var s_time = year + "-" + month + "-" + day


    var url = "/getRangePrices/" + stock_no + "/" + s_time + "/" + e_time;
    console.log("url:" + url)
    //instance.get('/getRangePrices/2330/2018-07-01/2018-07-31')
    instance.get(url)
      .then(response => {
        var data = response.data.data;
        var new_list = {
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 500,
          },
          tooltip: {
            trigger: 'axis'
          },
          series: [{
            data: [],
            type: 'line'
          }]
        };

        var max = 0, min = 9999;
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].date);
          console.log(data[i].price);
          new_list.xAxis.data[i] = data[i].date;
          new_list.series[0].data[i] = data[i].price;
          //取最大
          if (data[i].price > max) {
            max = data[i].price;
          }
          //取最小
          if (data[i].price < min) {
            min = data[i].price;
          }
        }
        new_list.yAxis.max = Math.floor(max * 1.1);
        new_list.yAxis.min = Math.ceil(min * 0.9);

        line_chart_list = new_list;
        this.setState({ options: line_chart_list });
      })
      .catch(function (error) {
        console.log(error); // Network Error
        console.log(error.status); // undefined
        console.log(error.code); // undefined
      });
    //instance.get('/getRangePrices/2330/2018-07-01/2018-07-31')

    //.then(response => this.setState({ options: line_chart_list }))
    //   axios.get('https://api.github.com/users/maecapozzi')
    //    .then(response => this.setState({ username:JSON.stringify(line_chart_list) }))
  }

  render() {
    return (
      <div className='button__container'>
        <p>股票代碼 :
        <input className="no" value={this.stock_no} onChange={this.handleChange_no}></input></p>
        <p>查詢區間 :
        <select value={this.list_type} onChange={this.handleChange_type}>
            <option value="1_month">最近一個月</option>
            <option value="3_month">最近三個月</option>
            <option value="6_mounth">最近半年</option>
            <option value="1_year">最近一年</option>
            <option value="3_year">最近三年</option>
            <option value="all_year">全部資料</option>
          </select></p>
        <p />
        <button className='button' onClick={this.handleClick}>查詢</button>
        <hr />
        <p>目前挑選的股票代碼為:{stock_no}</p>
        <hr />
        <ReactEcharts
          option={line_chart_list}
          style={{ height: '350px', width: '100%' }}
          className='react_for_echarts' />
      </div>
    )
  }
}
export default App