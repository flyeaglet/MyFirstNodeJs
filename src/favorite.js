import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

var url_server = 'http://localhost:8000/'; //server ip

const styles = {
    card: {
        width: '16%',
        display: 'inline-block',
    },
};

var stockList = [];

export async function insertFavorite(account, stock_no) {
    console.log('insertFavorite!')

    //呼叫server寫入我的最愛
    var url = url_server + "setFavorite";
    console.log("url:" + url)

    var msg = { account: account, stock: stock_no, action: "insert" };
    //var msg = JSON.stringify(infos) 

    try {
        console.log("start msg:" + msg);
        await axios.post(url, msg);
        console.log("finish");
    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    }
}

export function deleteFavorite(account, stock_no) {
    console.log('deleteFavorite!')

    //呼叫server刪除我的最愛
    var url = url_server + "setFavorite";
    console.log("url:" + url)

    var msg = { account: account, stock: stock_no, action: "delete" };
    //var msg = JSON.stringify(infos)

    try {
        var response = axios.post(url, msg);
    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    }
}

async function getFavorite(account) {
    console.log('getFavorite!')

    //取得我的最愛清單資訊

    //呼叫server刪除我的最愛
    var url = url_server + "getFavorite";
    console.log("url:" + url)

    var msg = { account: account };

    try {
        var response = await axios.post(url, msg);
    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    }

    //承接回傳資訊
    var list = response.data;

    //定義框架
    stockList = []; //reset

    for (var i = 0; i < list.length; i++) {
        var newStock =
            <div >
                <Card >
                    <CardActionArea>
                        <CardContent>
                            <Typography variant="display2" color="textSecondary" >
                            {list[i].name}  <font size="5">{list[i].id}</font>
                            </Typography>
                            <Typography variant="display1" component="h2" align="center">{list[i].price}</Typography>
                            <br />
                            <Typography color="textSecondary" align="center">▼ {list[i].fluct}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ {list[i].percent}%</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        await stockList.push(newStock);
        console.log("list[i].id:"+list[i].id);
        console.log("list[i].name:"+list[i].name);
        console.log("list[i].price:"+list[i].price);
        console.log("list[i].fluct:"+list[i].fluct);
        console.log("list[i].percent:"+list[i].percent);
        console.log("---------------------------------");
    }

    return 'success'
}


function Favorite(props) {
    const { classes } = props;
    var chk = getFavorite(props.user);
    
    console.log("return:"+chk) 
    return (
        stockList
    );
}

Favorite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Favorite);
