

//抓取當天日期
today_src = new Date();
//取年
year = today_src.getFullYear()
//取月
if ((today_src.getMonth()+1)<10)
    mouth = "0"+(today_src.getMonth()+1)
else
    mouth =""+(today_src.getMonth()+1)
//取日
if (today_src.getDate()<10)
    day = "0"+today_src.getDate() 
else
    day =""+today_src.getDate() 
today =  year+""+mouth+""+day
console.log("today:"+today);

var reader = require( './read_web.js' )
reader.read_twse(today); //台灣證券交易所(上市)
//reader.read_tpex(today); //證券櫃檯買賣中心(上櫃)
//reader.read_twse('20180630');

console.log("資料寫入完成!");