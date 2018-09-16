import axios from 'axios';

var CryptoJS = require("crypto-js");
var url_server = "http://122.117.34.101:8000/"; //server ip
//var util = require("util")

//登入
export async function login(acc, pwd) {
    //登入驗證
    var url = url_server + "login";
    console.log("url:"+url)

    var infos = { "account": acc, "password": pwd };
    var msg = {"msg":await encoder(infos)};
    var res_msg = {"success":"","msg":""}

    try {
        var response = await axios.post(url,msg);
        res_msg = {"success":response.data.success,"msg":response.data.msg}
        var s_res_msg = JSON.stringify(res_msg)
    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    }
    return s_res_msg;
}

//登出
export function logout() {

}

//註冊
export async function register(acc, pwd, mail, sex) {
    //註冊驗證
    var url = url_server + "register";
    console.log("url:"+url)

    var infos = { "account": acc, "password": pwd, "mail": mail, "sex": sex,};
    var msg = {"msg":await encoder(infos)};

    var res_msg = {"success":"","msg":""}

    try {
        var response = await axios.post(url,msg);
        res_msg = {"success":response.data.success,"msg":response.data.msg}
        var s_res_msg = JSON.stringify(res_msg)
    }
    catch (e) {
        console.log(e); // Network Error
        console.log(e.status); // undefined
        console.log(e.code); // undefined
    }
    return s_res_msg;
}

//加密用
async function encoder(infos)
{
    var plaintText = JSON.stringify(infos);
    var keyStr = "ka0132oftreeNode"

    // 字符串类型的key用之前需要用uft8先parse一下才能用
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    
    // 加密
    var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    var encryptedBase64Str = encryptedData.toString();
    // 输出：'RJcecVhTqCHHnlibzTypzuDvG8kjWC+ot8JuxWVdLgY='
    console.log(encryptedBase64Str);
    
    // 需要读取encryptedData上的ciphertext.toString()才能拿到跟Java一样的密文
    var encryptedStr = encryptedData.ciphertext.toString();
    // 输出：'44971e715853a821c79e589bcd3ca9cee0ef1bc923582fa8b7c26ec5655d2e06'
    console.log(encryptedStr);
    
    // 拿到字符串类型的密文需要先将其用Hex方法parse一下
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);
    
    // 将密文转为Base64的字符串
    // 只有Base64类型的字符串密文才能对其进行解密
    encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    
    return encryptedBase64Str;

}