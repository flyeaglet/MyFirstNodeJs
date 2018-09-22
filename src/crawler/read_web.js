
module.exports =
    {

        read_twse: function (today) {
            //顯示處理日
            console.log("處理日期:" + today)

            //載入MySQL模組
            var mysql = require('mysql');

            //建立連線
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'stock',
                insecureAuth: true
            });

            //開始連接
            connection.connect();

            //連線測試
            connection.query('SELECT name,number FROM stock.list_t', function (error, rows, fields) {
                //檢查是否有錯誤
                if (error) {
                    throw error;
                    return;
                }
            });

            //開始回寫股票清單
            var jsonUrl = "http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=" + today + "&type=ALL"
            //var jsonUrl = "http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20180626&type=ALL"
            var request = require("request");
            console.log("網址: " + jsonUrl);

            request({
                url: jsonUrl,
                method: "GET"
            },
                function (error, response, body) {
                    if (error || !body) {
                        console.log("沒有抓到資料: " + jsonUrl);
                        return;
                    }
                    else {
                        // 如果沒有資料，會出現 404 的 html 網頁，此時就重新抓取
                        if (body.indexOf('html') != -1) {
                            console.log("Can't not read!");
                        }
                        else {
                            twse = JSON.parse(body);

                            if (twse.stat == "很抱歉，沒有符合條件的資料!") {
                                console.log("很抱歉，沒有符合條件的資料!");
                                return;
                            }

                            if (twse.stat == "查詢日期大於今日!") {
                                console.log("查詢日期大於今日!");
                                return;
                            }


                            for (i = 0; i < twse.data5.length; i++) {
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
                                if (twse.data5[i][9] == "<p style= color:red>+</p>") {
                                    //正的
                                    ls_twse008 = twse.data5[i][10];
                                }
                                else {
                                    //負的
                                    ls_twse008 = "-" + twse.data5[i][10];
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

                                connection.query('INSERT INTO stock.twse_t SET ?', data, function (error) {
                                    if (error) {
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
                                connection.query('INSERT INTO stock.name_t SET ?', data2, function (error) {
                                    if (error) {
                                        //console.log('WARRNING:寫入說明失敗！');
                                    }
                                    else {
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
        read_tpex: function (today,s_today) {
            //載入MySQL模組
            var mysql = require('mysql');

            //建立連線
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'stock',
                insecureAuth: true
            });

            //開始連接
            connection.connect();

            //連線測試
            connection.query('SELECT name,number FROM stock.list_t', function (error, rows, fields) {
                //檢查是否有錯誤
                if (error) {
                    throw error;
                    return;
                }
            });

            //開始回寫股票清單
            var jsonUrl = "http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_download.php?l=zh-tw&d="+today+"&s=0,asc,0"
            //var jsonUrl = "http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_download.php?l=zh-tw&d=107/08/21&s=0,asc,0"
            var request = require("request");
            console.log("網址: " + jsonUrl);

            request({
                url: jsonUrl,
                //如果沒有指定編碼方式null會造成取用預設編碼導致資料出現亂碼
                encoding: null,
                method: "GET"
            },
                function (error, response, body) {
                    if (error || !body) {
                        console.log("沒有抓到資料: " + jsonUrl);
                        return;
                    }
                    else {
                        // 如果沒有資料，會出現 404 的 html 網頁，此時就重新抓取
                        if (body.indexOf('html') != -1) {
                            console.log("Can't not read!");
                        }
                        else {
                            //編碼(自BIG5)
                            var iconv = require('iconv-lite');
                            var list = iconv.decode(body, 'BIG5')

                            var s_idx = list.indexOf('次日跌停價', 1) + 7 //找到頭
                            var e_idx = list.indexOf('管理股票', 1) - 1 //找到尾
                            var list_csv = list.substr(s_idx, e_idx - s_idx) //去掉頭尾的說明

                            const csv = require('csvtojson')
                            csv({
                                noheader: true,
                                output: "json"
                            })
                                .fromString(list_csv)
                                .then((tpex) => {
                                    //console.log(csvRow) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
                                    //代號         field1  twse001
                                    //名稱         field2  
                                    //收盤         field3  twse007
                                    //漲跌         field4  twse008
                                    //開盤         field5  twse004
                                    //最高         field6  twse005
                                    //最低         field7  twse006
                                    //均價         field8  
                                    //成交股數     field9  twse003
                                    //成交金額(元) field10
                                    //成交筆數     field11
                                    //最後買價     field12
                                    //最後賣價     field13
                                    //發行股數     field14
                                    //次日參考價   field15
                                    //次日漲停價   field16
                                    //次日跌停價   field17
                                    for (i = 0; i < tpex.length - 1; i++) {

                                        ls_twse001 = tpex[i].field1;
                                        //ls_twse002 = today;
                                        ls_twse002 = s_today;

                                        ls_twse003 = new String('');
                                        ls_twse003 = tpex[i].field9;
                                        //去除,避免危險 做五次
                                        ls_twse003 = ls_twse003.replace(",", "")
                                        ls_twse003 = ls_twse003.replace(",", "")
                                        ls_twse003 = ls_twse003.replace(",", "")
                                        ls_twse003 = ls_twse003.replace(",", "")
                                        ls_twse003 = ls_twse003.replace(",", "")

                                        ls_twse004 = tpex[i].field5;
                                        ls_twse005 = tpex[i].field6;
                                        ls_twse006 = tpex[i].field7;
                                        ls_twse007 = tpex[i].field3;

                                        ls_twse008 = new String('');
                                        ls_twse008 = tpex[i].field4;
                                        ls_twse008 = ls_twse008.replace("+", "")

                                        //tpex沒有本益比
                                        ls_twse009 = '';

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

                                        connection.query('INSERT INTO stock.twse_t SET ?', data, function (error) {
                                            if (error) {
                                                console.log('寫入資料失敗！');
                                                console.log(error);
                                                return;
                                                //throw error;
                                            }
                                        });

                                        //寫入說明
                                        ls_name001 = tpex[i].field1;
                                        ls_name002 = 'zh_TW'
                                        ls_name003 = tpex[i].field2;
                                        var data2 = {
                                            name001: ls_name001,
                                            name002: ls_name002,
                                            name003: ls_name003
                                        };
                                        connection.query('INSERT INTO stock.name_t SET ?', data2, function (error) {
                                            if (error) {
                                                //console.log('WARRNING:寫入說明失敗！');
                                            }
                                            else {
                                                //console.log('INFO:寫入名稱['+ls_name001+']['+ls_name003+']');
                                            }
                                        });
                                    }
                                })
                        }
                    }
                });
        }
    };
