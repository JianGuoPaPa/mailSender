var Axios = require("axios");

module.exports = {

    // 骚话接口
    getHoneyedWords () {
        return new Promise((resolve) => {
            const url = "https://chp.shadiao.app/api.php";
            //获取这个接口的信息
            resolve(Axios.get(url))
        })
    },

    // 天气接口
    getWeather () {
        return new Promise((resolve) => {
            const url = "https://www.baidu.com/s?wd=%E6%AD%A6%E6%B1%89%E5%A4%A9%E6%B0%94";
            //获取这个接口的信息
            resolve(Axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
                }
            }))
        })
    },

    // 毛片接口
    getCat () {
        return new Promise((resolve) => {
            const url = `https://www.baidu.com/s?wd=%E7%8C%AB%E5%9B%BE${(Math.random() * 10).toFixed()}`;
            //获取这个接口的信息
            resolve(Axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
                }
            }))
        })
    }
}