import axios from 'axios'

var url_server = "http://localhost:8000/";

function option() {
    this.type = {
        title: {
            text: '個股單價',
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
};

export function getDate(list_type) {

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
        default :
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

    var time = { start: s_time, end: e_time };

    return time;

}

export async function getStockPrices(stock_no, s_time, e_time) {

    //刷新價格資訊
    var url = url_server + "getRangePrices/" + stock_no + "/" + s_time + "/" + e_time;
    console.log("url:" + url)

    //instance.get('/getRangePrices/2330/2018-07-01/2018-07-31')
    var new_otion = new option();
    var new_list = new_otion.type;
    new_list.title.text = '個股單價';
    new_list.yAxis.name = '單價:元(NT)';

    //console.log( 'log0:'+JSON.stringify(otion));
    console.log('log1:' + JSON.stringify(new_list));
    try {
        console.log('test')
        const response = await axios(url);
        var data = response.data.data;
        console.log('response' + response)
        //var max = 0, min = 9999;
        var tmp_array = [];
        for (var i = 0; i < data.length; i++) {
            //console.log(data[i].date);
            //console.log(data[i].price);
            new_list.xAxis.data[i] = data[i].date;
            new_list.series[0].data[i] = data[i].price;
            if (data[i].price !== undefined)
                tmp_array[i] = data[i].price;
        }

        new_list.yAxis.max = Math.floor(Math.max.apply(null, tmp_array) * 1.1); //求最大值 
        new_list.yAxis.min = Math.ceil(Math.min.apply(null, tmp_array) * 0.9); //求最小值
    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    }
    // console.log( 'log2:'+JSON.stringify(new_list));
    return JSON.stringify(new_list);
}

export async function getTradingVolume(stock_no, s_time, e_time) {
    var url = url_server + "getTraceAmount/" + stock_no + "/" + s_time + "/" + e_time;
    console.log("url:" + url)

    //instance.get('/getTraceAmount/2330/2018-07-01/2018-07-31')
    var new_otion = new option();
    var new_list = new_otion.type; //初始化 
    new_list.title.text = '交易量';
    new_list.yAxis.name = '數量:張';
    try {
        console.log('test')
        const response = await axios(url);
        var data = response.data.data;

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

    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    } 


    return JSON.stringify(new_list);
}