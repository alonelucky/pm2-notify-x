const axios = require('axios');
const baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=';

class WxWorkBot {
    constructor(conf) {
        this.keys = conf.weworkkeys?.split(',') ?? [];
    }

    send(params) {
        for (let key of this.keys) {
            sendMsg(key, params).then(data => {
                console.log(data.data);
            }).catch(err => {
                console.error(err);
            });
        }
    }
}

// 发送机器人消息
/**
 * 
 * @param {*} key 
 * @param {object} params 
 * @param {String} params.name
 * @param {Number} params.id
 * @param {String} params.time
 * @param {String} params.msg
 * @param {String} params.times 单位时间内触发次数
 * @param {String} params.delay 延迟触发间隔
 * @returns 
 */
function sendMsg(key, params) {
    return axios.post(`${baseUrl}${key}`, {
        msgtype: 'markdown',
        markdown: {
            content: `**进程名: ${params.name} ${params.id}**
<font color="comment">${params.time} (${params.delay}秒发生${params.times}次)</font>
> ${params.msg}`
        },
    });
}

module.exports = WxWorkBot;
