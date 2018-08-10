//指定日期後31天寫入
var startDate = new Date('7/13/2018');
var reader = require( './read_web.js' )
for (var i = 0; i < 251; i++) 
{
    a(i);
}

function a(num)
{
    setTimeout
    (
        function()
        {
            //dateString = startDate.getFullYear()+''+(startDate.getMonth()+1)+''+startDate.getDate();
            dateString = getDateString(startDate);
            console.log(dateString);

            //抓取資料
            reader.read_twse(dateString);

            //計算下一天
            var tempDate = startDate.getDate();
            startDate.setDate(tempDate + 1);
            
        }, 20000 * (num + 1)
    );
}

function getDateString(date)
{
    //抓取當天日期
    today_src = new Date();
    today_src = date;
    
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

    return today;
}