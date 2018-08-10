
module.exports = 
{

    read_twse : function(today)
    {
        //顯示處理日
        console.log("處理日期:"+today)

        //載入MySQL模組
        var mysql = require('mysql');

        //建立連線
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'stock',
            insecureAuth : true
        });

        //開始連接
        connection.connect();

        //連線測試
        connection.query('SELECT name,number FROM stock.list_t',function(error, rows, fields){
            //檢查是否有錯誤
            if(error)
            {
                throw error;
                return;
            }
        });

        //開始回寫股票清單
        var jsonUrl = "http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date="+today+"&type=ALL"
        //var jsonUrl = "http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20180626&type=ALL"
        var request = require("request");
        console.log("網址: "+jsonUrl);

        request({
            url: jsonUrl,
            method: "GET"
        }, 
        function(error, response, body) 
        {
            if (error || !body) 
            {
                console.log("沒有抓到資料: "+jsonUrl);
                return;
            } 
            else 
            {
                // 如果沒有資料，會出現 404 的 html 網頁，此時就重新抓取
                if (body.indexOf('html') != -1) {
                    console.log("Can't not read!");
                } 
                else 
                {
                    twse = JSON.parse(body);

                    if (twse.stat == "很抱歉，沒有符合條件的資料!")
                    {
                        console.log("很抱歉，沒有符合條件的資料!");
                        return;
                    }   

                    if (twse.stat == "查詢日期大於今日!")
                    {
                        console.log("查詢日期大於今日!");
                        return;
                    } 


                    for (i=0;i<twse.data5.length;i++)
                    {
                        // 台灣證券交易所
                        // twse001 代碼(0)
                        // twse002 日期
                        // twse003 成交股數(2)
                        // twse004 開盤價(5)
                        // twse005 最高價(6)
                        // twse006 最低價(7)
                        // twse007 收盤價(8)
                        // twse008 價差(10)
                        // twse009 本益比(15)
                        ls_twse001 = twse.data5[i][0];
                        ls_twse002 = today;
                        ls_twse003 = twse.data5[i][2];
                        //去除,避免危險 做五次
                        ls_twse003 = ls_twse003.replace(",", "")
                        ls_twse003 = ls_twse003.replace(",", "")
                        ls_twse003 = ls_twse003.replace(",", "")
                        ls_twse003 = ls_twse003.replace(",", "")
                        ls_twse003 = ls_twse003.replace(",", "")

                        ls_twse004 = twse.data5[i][5];
                        ls_twse005 = twse.data5[i][6];
                        ls_twse006 = twse.data5[i][7];
                        ls_twse007 = twse.data5[i][8];
                        if (twse.data5[i][9] == "<p style= color:red>+</p>")
                        {
                            //正的
                            ls_twse008 = twse.data5[i][10];
                        }
                        else
                        {
                            //負的
                            ls_twse008 = "-"+twse.data5[i][10];
                        }
                        ls_twse009 = twse.data5[i][15];

                        var data = {
                            twse001: ls_twse001,
                            twse002: ls_twse002,
                            twse003: ls_twse003,
                            twse004: ls_twse004,
                            twse005: ls_twse005,
                            twse006: ls_twse006,
                            twse007: ls_twse007,
                            twse008: ls_twse008,
                            twse009: ls_twse009
                        };

                        connection.query('INSERT INTO stock.twse_t SET ?', data, function(error){
                            if(error)
                            {
                                console.log('寫入資料失敗！');
                                console.log(error);
                                return;
                                //throw error;
                            }
                        });

                        //寫入說明
                        ls_name001 = twse.data5[i][0];
                        ls_name002 = 'zh_TW'
                        ls_name003 = twse.data5[i][1];
                        var data2 = {
                            name001: ls_name001,
                            name002: ls_name002,
                            name003: ls_name003
                        };
                        connection.query('INSERT INTO stock.name_t SET ?', data2, function(error){
                            if(error)
                            {
                                //console.log('WARRNING:寫入說明失敗！');
                            }
                            else
                            {
                                //console.log('INFO:寫入名稱['+ls_name001+']['+ls_name003+']');
                            }
                        });
                    }
            }
        }
    });

    //connection.end();

    }
    ,
    read_tpex: function(today)
    {
      
    }
};
