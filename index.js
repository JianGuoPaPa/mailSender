var nodemailer = require("nodemailer");    // node邮件
var utils = require("./utils.js");
require('colors')      // 控制台打印颜色
var api = require("./api.js"); //数据接口
var schedule = require('node-schedule')     // 定时任务
var cheerio = require('cheerio')

// 短时间内发送数量超过15条会暂停服务一段时间
// 例如设置每5秒一次定时器去发邮件，会返回登录失败的提示
// 这时不要尝试去修改授权码，只需等待10分钟即可恢复使用

// 发送邮件函数
async function sendMail(data) {
    const user = "123456@qq.com";//自己的邮箱
    const pass = "123456"; //qq邮箱授权码,如何获取授权码下面有讲
    const to = "123456@qq.com";//对方的邮箱
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 587,
        secure: false,
        auth: {
            user: user, // 用户账号
            pass: pass, //授权码,通过QQ获取
        },
    });
    let template = `
               <h5>
                    今天是${utils.getYMD()} ${data.weather.temperature}℃ ${data.weather.weather}
                    <div style="${data.weather.image};padding: 40px;background-repeat:no-repeat;margin-top: 15px;position: fixed;top: 0;right: 0;" ></div>
               </h5> 
               <p style="padding: 50px 0 50px;">${data.HoneyedWords}</p>
               <img style="width: 100%;max-width: 350px;display: block;margin: 0 auto;" src="${data.catImg}" alt="">
               <h5 style="text-align: right;">你的罗密欧</h5>
              `
    console.log(template)
    // 发送目标邮件
    await transporter.sendMail({
        from: `你的罗密欧<${user}>`, // 发送人落款 (不包含发送人邮箱则发送失败)
        to: `世上最美的人<${to}>`, // 接收人标题 (不包含收件人邮箱则发送失败)
        subject: "我最亲爱的朱丽叶", // 邮件标题
        html: template
    });
    // 通知自己邮件已发送
    await transporter.sendMail({
        from: `你的罗密欧<${user}>`, // 发送人落款 (不包含发送人邮箱则发送失败)
        to: `你的罗密欧<${user}>`, // 接收人标题 (不包含收件人邮箱则发送失败)
        subject: "今日邮件已发送", // 邮件标题
        html: template
    });
    console.log('发送成功', new Date().toLocaleTimeString())
}

// 获取数据
async function fetchData() {
    //骚话
    const HoneyedWords = await api.getHoneyedWords()
    //天气
    const weatherData = await api.getWeather()
    const catData = await api.getCat()
    //获取失败抛错
    if (![HoneyedWords, weatherData, catData].every(item => item.status === 200)) {
        console.log('获取数据失败'.red)
        console.log(`骚话：${HoneyedWords.status}, 天气：${weatherData.status}, 猫片：${catData.status}`.red)
        return
    }
    // 爬取天气数据
    let $ = cheerio.load(weatherData.data);
    const temperature = $('.op_weather4_twoicon_shishi_title').text()   //温度
    const weather = $('.op_weather4_twoicon_shishi_sub').text()     //天气
    const image = $('.op_weather4_twoicon_icon').attr('style').split('.png')[0] + '.png)'   //图片
    // 爬取猫片
    $ = cheerio.load(catData.data);
    const catImg = $('.op-img-address-link-imgs').attr('src')
    // 传递数据
    weatherData.data = { temperature, weather, image }
    //过滤不够骚的话
    const sensitiveWords = ['晚安']
    sensitiveWords.forEach(word => {
        if (HoneyedWords.data.indexOf(word) > -1) {
            fetchData()
            return
        }
    })
    //插入换行标签
    HoneyedWords.data = HoneyedWords.data.replace('\n', '<br />')
    //如果含有落款，去除
    HoneyedWords.data = HoneyedWords.data.split('——')
    HoneyedWords.data = HoneyedWords.data[0]
    const sendData = {
        HoneyedWords: HoneyedWords.data,
        weather: weatherData.data,
        catImg
    }
    // console.log(sendData)
    sendMail(sendData)
}

fetchData()


//每天下午5点21分发送
// schedule.scheduleJob({hour: 16, minute: 33, second: 45}, function () {
//     console.log(("启动任务:" + new Date().toLocaleTimeString()).green);
//     fetchData()
// });

//循环发送
// for (let i = 0; i <= 99; i++) {
// setInterval(() => {
//     fetchData()
// }, 5000)
// // }
