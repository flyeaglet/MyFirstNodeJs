//指定日期後31天寫入
var startDate = new Date('8/22/2018');
var endDate = new Date('8/22/2018');
var today = new Date();

var reader = require('./read_web.js')
for (var i = 0; today > endDate; i++) {
    
    //一次增加一天
    endDate.setDate(endDate.getDate() + 1);

    console.log('end:'+endDate+", today:"+today)

    a(i);
}

function a(num) {
    setTimeout
        (
        function () {
            dateString1 = getDateString(startDate, 'twse');
            console.log(dateString1);

            //抓取資料(twse)
            //reader.read_twse(dateString);

            dateString2 = getDateString(startDate, 'tpex');
            console.log(dateString2);

            //抓取資料(twse)
            reader.read_tpex(dateString2,dateString1);

            //計算下一天
            var tempDate = startDate.getDate();
            startDate.setDate(tempDate + 1);

        }, 10000 * (num + 1)
        );
}

function getDateString(date, type) {
    //抓取當天日期
    today_src = new Date();
    today_src = date;

    //取年
    year = today_src.getFullYear()
    //取月
    if ((today_src.getMonth() + 1) < 10)
        mouth = "0" + (today_src.getMonth() + 1)
    else
        mouth = "" + (today_src.getMonth() + 1)
    //取日
    if (today_src.getDate() < 10)
        day = "0" + today_src.getDate()
    else
        day = "" + today_src.getDate()

    if (type == 'twse') {
        today = year + "" + mouth + "" + day

    }
    else {
        today = (year - 1911) + "/" + mouth + "/" + day
    }

    //console.log("today:" + today);

    return today;
}