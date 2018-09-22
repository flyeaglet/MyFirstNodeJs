import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
import classNames from 'classnames';
import Select from 'react-select';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import Stock from './stock'; //股票區塊

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
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//先準備相關資訊
var instance = axios.create({
  baseURL: 'http://localhost:8000'
});
var getInfos = require('./getStockInfo.js')
var account = require('./account.js')

//Module variable
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

//使用者資訊
var user_info = {
  logined: false, //是否已經登入
  account: "", //帳號
}

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
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
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
      login_open: false, //跳窗登入
      msg_open: false, //訊息顯示
      msg: "", //提示用訊息變數
      register_open: false, //跳窗註冊
      login_disable: false, //是否顯示login按鈕
      logout_disable: true, //是否顯示logout按鈕
    }

    var url = "/getStock/list/ALL";
    instance.get(url).then(response => {
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
    this.login_accept = this.login_accept.bind(this); //登入確認
    this.register_accept = this.register_accept.bind(this); //註冊確認

  }

  handleChange_no_edit(value) {
    var url = "/getStock/list/" + value;
    instance.get(url).then(response => {
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

  //開啟登入窗
  login_open = () => {
    this.setState(state => ({ login_open: true }));
  };

  //確認登入
  async login_accept() {

    var acc = document.getElementById("login_account").value;
    var pwd = document.getElementById("login_password").value;

    //判斷登入成功否 
    var login_msg = await account.login(acc, pwd);
    var s_login_msg = JSON.parse(login_msg);

    //判斷成功或失敗
    if (s_login_msg.success) {
      //提示成功
      this.setState(state => ({ msg: s_login_msg.msg }));
      this.setState(state => ({ msg_open: true }));

      //關閉輸入窗
      this.setState(state => ({ login_open: false }));

      //紀錄登入狀態與資訊
      user_info.logined = true; //已登入
      user_info.account = acc;

      //重整login logout按鈕
      this.setState(state => ({ login_disable: true, logout_disable: false }));
    }
    else {
      //失敗
      this.setState(state => ({ msg: s_login_msg.msg }));
      this.setState(state => ({ msg_open: true }));
    }

  };

  //放棄登入
  login_cancel = () => {
    this.setState(state => ({ login_open: false }));
  };

  //開啟登入窗
  register_open = () => {
    this.setState(state => ({ register_open: true }));
  };


  //確認註冊
  async register_accept() {

    var acc = document.getElementById("register_account").value;
    var pwd = document.getElementById("register_password").value;
    var pwd2 = document.getElementById("register_password2").value;
    var mail = document.getElementById("register_mail").value;

    //檢核兩個密碼是否一致
    if (pwd != pwd2) {
      //失敗
      this.setState(state => ({ msg: "兩次密碼輸入不一致，請重新確認！" }));
      this.setState(state => ({ msg_open: true }));
    }

    //判斷註冊成功否 
    var register_msg = await account.register(acc, pwd, mail);
    var s_register_msg = JSON.parse(register_msg);

    //判斷成功或失敗
    if (s_register_msg.success) {
      //提示成功
      this.setState(state => ({ msg: s_register_msg.msg }));
      this.setState(state => ({ msg_open: true }));
      //關閉輸入窗
      this.setState(state => ({ register_open: false }));
    }
    else {
      //失敗
      this.setState(state => ({ msg: s_register_msg.msg }));
      this.setState(state => ({ msg_open: true }));
    }
  };

  //放棄註冊
  register_cancel = () => {
    this.setState(state => ({ register_open: false }));
  };

  //點選確認後關閉
  msg_close = () => {
    this.setState(state => ({ msg_open: false }));
  };

  //登出
  logout = () => {
    //紀錄登入狀態與資訊
    user_info.logined = false; //未登入
    user_info.account = "";

    //重整login logout按鈕
    this.setState(state => ({ login_disable: false, logout_disable: true }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className='top'>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit" className={classes.flex}>
                <font className='title' face="微軟正黑體" size="8"><b>股票查詢</b></font><font className='title' face="微軟正黑體" size="3"><b>T.H</b></font>
              </Typography>
              <Button color="inherit" disabled={this.state.login_disable} onClick={this.login_open}>Login</Button>
              <Button color="inherit" disabled={this.state.logout_disable} onClick={this.logout}>Logout</Button>
            </Toolbar>
          </AppBar>
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

        <Stock />

        <div>
          <Dialog open={this.state.login_open} onClose={this.login_cancel} aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title">請輸入帳號以及密碼：</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="login_account"
                label="請輸入帳號"
                type="account"
                fullWidth
              />
              <TextField
                margin="dense"
                id="login_password"
                label="請輸入密碼"
                type="password"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.register_open} color="primary">註冊新帳號</Button>
              <Button onClick={this.login_cancel} color="primary">放棄</Button>
              <Button onClick={this.login_accept} color="primary">確認</Button>
            </DialogActions>
          </Dialog>
        </div>

        <Dialog open={this.state.msg_open} onClose={this.msg_close} aria-labelledby="form-dialog-title" >
          <DialogTitle id="form-dialog-title">{this.state.msg}</DialogTitle>
          <DialogActions>
            <Button onClick={this.msg_close} color="primary">確認</Button>
          </DialogActions>
        </Dialog>

        <div>
          <Dialog open={this.state.register_open} onClose={this.register_cancel} aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title">請輸入以下資訊以完成註冊步驟：</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="register_account"
                label="請輸入帳號"
                type="account"
                fullWidth
              />
              <TextField
                margin="dense"
                id="register_password"
                label="請輸入密碼"
                type="password"
                fullWidth
              />
              <TextField
                margin="dense"
                id="register_password2"
                label="請再次輸入密碼"
                type="password"
                fullWidth
              />
              <TextField
                margin="dense"
                id="register_mail"
                label="請輸入聯絡信箱"
                type="mail"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.register_cancel} color="primary">放棄</Button>
              <Button onClick={this.register_accept} color="primary">確認</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(App);