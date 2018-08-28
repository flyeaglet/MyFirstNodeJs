import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';


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

var line_chart_list2 = {
  xAxis: {
    type: 'category',
    data: ['default']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [0],
    type: 'bar'
  }]
};


var stock_no = "";
var list_type = "1_month";


//取得股票清單
var stock_list = [];

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    fontSize: 16,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          ref: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={event => {
        props.removeProps.onClick();
        props.removeProps.onMouseDown(event);
      }}
    />
  );
}

const components = {
  Option,
  Control,
  NoOptionsMessage,
  Placeholder,
  SingleValue,
  MultiValue,
  ValueContainer,
};

class App extends Component {
  constructor() {
    super()
    this.state = {
      stock_no: "",
      list_type: "1_month"
    }

    var url = "/getStock/list/ALL";
    instance.get(url).
      then(response => {
        var data = response.data;
        var ls_stock_list = new Array()
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].id + "(" + data[i].name + ")");
          ls_stock_list[i] = { label: data[i].id + "(" + data[i].name + ")" };
        }
        stock_list = ls_stock_list;
        this.forceUpdate();
      });

    this.handleClick = this.handleClick.bind(this);
    this.handleChange_no_edit = this.handleChange_no_edit.bind(this);
  }

  handleChange_no_edit(value) {
    var url = "/getStock/list/" + value;
    instance.get(url).
      then(response => {
        var data = response.data;
        var ls_stock_list = new Array()
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].id + "(" + data[i].name + ")");
          ls_stock_list[i] = { label: data[i].id + "(" + data[i].name + ")" };
        }
        stock_list = ls_stock_list;
        this.forceUpdate();
      });
  }

  handleChange_no(event) {
    // event.target 是當前的 DOM elment
    // 從 event.target.value 取得 user 剛輸入的值
    // 將 user 輸入的值更新回 state
    stock_no = event.label;
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

    //取得時間區間起始
    var s_time = year + "-" + month + "-" + day

    //取得編號部分
    var ls_tmp = stock_no;
    if (ls_tmp.indexOf("(", 0) > 0) {
      stock_no = ls_tmp.substr(0, ls_tmp.indexOf("(", 0));
    }

    //刷新價格資訊
    var url = "/getRangePrices/" + stock_no + "/" + s_time + "/" + e_time;
    console.log("url:" + url)
    //instance.get('/getRangePrices/2330/2018-07-01/2018-07-31')
    instance.get(url)
      .then(response => {
        var data = response.data.data;
        var new_list = {
          title: {
            text: '個股單價',
            //subtext: '数据来自西安兰特水电测控技术有限公司',
            x: 'center',
            align: 'right',
            y: '15px'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            name: '單價:元(NT)',
            type: 'value',
            min: 0, //最小
            max: 500, //最大
          },
          tooltip: { //提示
            trigger: 'axis'
          },
          series: [{
            data: [],
            type: 'line'
          }]
        };

        //var max = 0, min = 9999;
        var tmp_array = [];
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].date);
          console.log(data[i].price);
          new_list.xAxis.data[i] = data[i].date;
          new_list.series[0].data[i] = data[i].price;
          if (data[i].price != undefined)
          tmp_array[i] = data[i].price;
        }

        new_list.yAxis.max = Math.floor(Math.max.apply(null, tmp_array) * 1.1); //求最大值 
        new_list.yAxis.min = Math.ceil(Math.min.apply(null, tmp_array) * 0.9); //求最小值

        line_chart_list = new_list;
        this.forceUpdate();
      })
      .catch(function (error) {
        console.log(error); // Network Error
        console.log(error.status); // undefined
        console.log(error.code); // undefined
      });

    //刷新交易量
    var url = "/getTraceAmount/" + stock_no + "/" + s_time + "/" + e_time;
    console.log("url:" + url)
    //instance.get('/getTraceAmount/2330/2018-07-01/2018-07-31')
    instance.get(url)
      .then(response => {
        var data = response.data.data;
        var new_list = {
          title: {
            text: '個股交易量',
            //subtext: '数据来自西安兰特水电测控技术有限公司',
            x: 'center',
            align: 'right',
            y: '15px'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            name: '交易股數',
            type: 'value',
            min: 0, //最小
            max: 500, //最大
          },
          tooltip: { //提示
            trigger: 'axis'
          },
          series: [{
            data: [],
            type: 'line'
          }]
        };

        var tmp_array = [];
        for (var i = 0; i < data.length; i++) {
          new_list.xAxis.data[i] = data[i].date;
          new_list.series[0].data[i] = data[i].amount;
          tmp_array[i] = data[i].amount;
        }

        var max = Math.max.apply(null, tmp_array); //求最大值 
        var min = Math.min.apply(null, tmp_array); //求最小值

        new_list.yAxis.max = max * 1.2;
        new_list.yAxis.min = min * 0.8;

        line_chart_list2 = new_list;
        this.forceUpdate();
      })
      .catch(function (error) {
        console.log(error); // Network Error
        console.log(error.status); // undefined
        console.log(error.code); // undefined
      });

    //刷新KD線

    //刷新月營收

  }


  render() {
    const { classes } = this.props;
    return (
      <div>
        <div class='menu'>
          <button className='button' onClick={this.handleClick}>待用按鈕1</button><p />
          <button className='button' onClick={this.handleClick}>待用按鈕2</button><p />
          <button className='button' onClick={this.handleClick}>待用按鈕3</button><p />
          <button className='button' onClick={this.handleClick}>待用按鈕4</button><p />
          <button className='button' onClick={this.handleClick}>待用按鈕5</button><p />
          <button className='button' onClick={this.handleClick}>待用按鈕6</button><p />
        </div>
        <div class='parent'>
          <div class='search'><div class='search'>
            請挑選要查詢的股票代碼 :
              <Select
              classes={classes}
              options={stock_list}
              components={components}
              value={this.stock_no}
              onChange={this.handleChange_no}
              placeholder="填入查詢的股票代碼或說明"
              autoWidth="true"
              onInputChange={this.handleChange_no_edit}
              native="true"
            />
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
          </div></div>
          <div class='child'>
            <ReactEcharts
              option={line_chart_list}
              style={{ height: '350px', width: '100%' }}
              className='react_for_echarts' />
          </div>
          <div class='child'>
            <ReactEcharts
              option={line_chart_list2}
              style={{ height: '350px', width: '100%' }}
              className='react_for_echarts' />
          </div>
          <div class='child'>
            <ReactEcharts
              option={line_chart_list}
              style={{ height: '350px', width: '100%' }}
              className='react_for_echarts' />
          </div>
          <div class='child'>
            <ReactEcharts
              option={line_chart_list}
              style={{ height: '350px', width: '100%' }}
              className='react_for_echarts' />
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(App);