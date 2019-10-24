const axios = require('axios');

const {md5} = require('./lib');

const baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=';

class WxWorkBot{
    constructor(conf){
        this.splitChar = conf.splitChar || ',';
        this.keys = conf.wxworkBotKeys.split(this.splitChar);
    }

    send(params){
        for(let key of this.keys) {
            sendMsg(key, params).then(data=>{
                    console.log(data.data);
                }).catch(err=>{
                    console.error(err);
                });
        }
    }
}

// 发送机器人消息
function sendMsg(key, params){
    let list = params.isAll ? ['@all'] : [];
    return axios.post(`${baseUrl}${key}`, {
        msgtype: 'image',
        image: {
            base64: params.img.toString('base64'),
            md5: md5(params.img)
        },
        mentioned_list: list,
    });
}

module.exports = WxWorkBot;
