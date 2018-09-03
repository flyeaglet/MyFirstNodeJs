import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'
import classNames from 'classnames';
import Select from 'react-select';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

//material-ui
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import HistoryIcon from '@material-ui/icons/History';
import purple from '@material-ui/core/colors/purple';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

//先準備相關資訊
var instance = axios.create({
  baseURL: 'http://59.126.125.77:8000'
});
var getInfos = require('./stockInfos.js')

//顏色定義
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

//預設action 
var stock_no = "";
var selected_page_desc = '收盤價歷史紀錄'; //所在頁面說明
var selected_page = 'getStockPrices'; //所在頁面(預設為價格頁)

//取得股票清單
var stock_list = [];

const styles = theme => ({

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
  margin: {
    margin: theme.spacing.unit
  },
  search: {
    color: theme.palette.getContrastText(purple[200]),
    backgroundColor: purple[200],
    "&:hover": {
      backgroundColor: purple[400]
    },
    width: '90%',
    marginTop: '5%',
    marginLeft: '5%',
    marginright: '5%'
  },
  favorite: {
    color: theme.palette.getContrastText(pink[200]),
    backgroundColor: pink[200],
    "&:hover": {
      backgroundColor: pink[400]
    },
    width: '90%',
    marginTop: '5%',
    marginLeft: '5%',
    marginright: '5%'
  },
  history: {
    color: theme.palette.getContrastText(blue[200]),
    backgroundColor: blue[200],
    "&:hover": {
      backgroundColor: blue[400]
    },
    width: '90%',
    marginTop: '5%',
    marginLeft: '5%',
    marginright: '5%'
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
      list_type: "1_month",
      open: true,
      open2: false,
      open3: false,
      line_chart_list: line_chart_list,
      list_type: '1_month'
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

    //this.handleClick = this.handleClick.bind(this);
    this.handleChange_no = this.handleChange_no.bind(this);
    this.handleChange_show_chart = this.handleChange_show_chart.bind(this);
    this.handleChange_no_edit = this.handleChange_no_edit.bind(this); //下拉搜尋(編輯中)
    this.handleChange_getTradingVolume = this.handleChange_getTradingVolume.bind(this); //交易量
    this.handleChange_getStockPrices = this.handleChange_getStockPrices.bind(this); //收盤價
    this.handleChange_type = this.handleChange_type.bind(this); //日期區間(type)

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
    this.handleChange_show_chart();
  }

  /*   handleChange_type(event) {
      // event.target 是當前的 DOM elment
      // 從 event.target.value 取得 user 剛輸入的值
      // 將 user 輸入的值更新回 state
      list_type = event.target.value;
    } */

  handleChange_type = key => (event, value) => {
    this.state.list_type = value;
    this.handleChange_show_chart();
  };

  handleChange_getStockPrices() {
    selected_page = 'getStockPrices';
    selected_page_desc = '收盤價歷史紀錄';
    this.handleChange_show_chart();
  }

  handleChange_getTradingVolume() {
    selected_page = 'getTradingVolume';
    selected_page_desc = '成交量歷史紀錄';
    this.handleChange_show_chart();
  }

  async handleChange_show_chart() {

    //呈現相關資料
    console.log("no:" + stock_no);
    console.log("type:" + this.state.list_type);

    var time = {};
    time = getInfos.getDate(this.state.list_type);

    //抓取當天日期
    var s_time = time.start; //起始時間
    var e_time = time.end; //截止時間

    //取得編號部分
    var ls_tmp = stock_no;
    if (ls_tmp.indexOf("(", 0) > 0) {
      stock_no = ls_tmp.substr(0, ls_tmp.indexOf("(", 0));
    }
    var new_list;
    switch (selected_page) {
      case 'getStockPrices':
        //取得價格資訊
        new_list = await getInfos.getStockPrices(stock_no, s_time, e_time);
        line_chart_list = JSON.parse(new_list);
        break;
      case "getTradingVolume":
        //刷新交易量
        new_list = await getInfos.getTradingVolume(stock_no, s_time, e_time);
        line_chart_list = JSON.parse(new_list);
        break;
      case "c":
        //刷新KD線

        break;
      case "d":
        //刷新//刷新月營收

        break;
      default:

        break;
    }

    //刷新畫面
    this.forceUpdate();
  }


  //下拉展開(股票資訊)
  expand_option = () => {
    this.setState(state => ({ open: !state.open }));
  };

  //下拉展開(我的最愛)
  expand_option2 = () => {
    this.setState(state => ({ open2: !state.open2 }));
  };

  //下拉展開(瀏覽紀錄)
  expand_option3 = () => {
    this.setState(state => ({ open3: !state.open3 }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className='top'>
          <font className='title' face="微軟正黑體" size="8"><b>股票查詢</b></font><font className='title' face="微軟正黑體" size="3"><b>T.H</b></font>
          <p />
        </div>
        <div className='menu'>
          <ListItem button onClick={this.expand_option}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText inset primary="股票資訊查詢" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleChange_getStockPrices}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText inset primary="收盤價歷史紀錄" />
              </ListItem>
            </List>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleChange_getTradingVolume}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText inset primary="成交量歷史紀錄" />
              </ListItem>
            </List>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText inset primary="KD線查歷史紀錄" />
              </ListItem>
            </List>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <SearchIcon marginLeft="5%" />
                </ListItemIcon>
                <ListItemText inset primary="月營收歷史紀錄" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={this.expand_option2}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText inset primary="我的最愛" />
            {this.state.open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open2} timeout="auto" unmountOnExit>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText inset primary="收藏清單" />
              </ListItem>
            </List>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText inset primary="待開發" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={this.expand_option3}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText inset primary="瀏覽紀錄" />
            {this.state.open3 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open3} timeout="auto" unmountOnExit>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText inset primary="待開發" />
              </ListItem>
            </List>
            <List className="sub_button" component="div" disablePadding>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText inset primary="待開發" />
              </ListItem>
            </List>
          </Collapse>
        </div>

        <div className='parent'>
          <div className='search'><div className='search'>
            <font face="微軟正黑體" size="8"><b> {selected_page_desc} </b></font>
            <p />
            請挑選要查詢的股票代碼 :
              <Select
              classes={classes}
              options={stock_list}
              components={components}
              value={this.stock_no}
              onChange={this.handleChange_no}
              placeholder="請選擇欲查詢的股票代碼"
              autoWidth="true"
              onInputChange={this.handleChange_no_edit}
              native="true"
            />
            <p />
            查詢區間
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup row name="avatar" aria-label="avatar" value={this.state.list_type} onChange={this.handleChange_type('list_type')}>
                  <FormControlLabel value="1_month" control={<Radio />} label="最近一個月" />
                  <FormControlLabel value="3_month" control={<Radio />} label="最近三個月" />
                  <FormControlLabel value="6_mounth" control={<Radio />} label="最近半年" />
                  <FormControlLabel value="1_year" control={<Radio />} label="最近一年" />
                  <FormControlLabel value="3_year" control={<Radio />} label="最近三年" />
                  <FormControlLabel value="all_year" control={<Radio />} label="全部資料" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <hr />
            <p>目前挑選的股票代碼為:{stock_no}</p>
            <p />
            <hr />
          </div></div>
          <div className='child'>
            <ReactEcharts
              option={line_chart_list}
              style={{ height: '400px', width: '95%' }}
              className='react_for_echarts' />
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(App);