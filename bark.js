const axios = require('axios');

class Bark {
    constructor(conf) {
        this.urls = conf.barkurls?.split(',') ?? [];
    }

    send(params) {
        for (let url of this.urls) {
            sendMsg(url, params).then(data => {
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
 * @param {string} url 
 * @param {object} params 
 * @param {String} params.name
 * @param {Number} params.id
 * @param {String} params.time
 * @param {String} params.msg
 * @param {String} params.times 单位时间内触发次数
 * @param {String} params.delay 延迟触发间隔
 * @returns 
 */
function sendMsg(url, params) {
    return axios.post(url, {
        body: params.msg,
        title: `进程: ${params.name} ${params.id}(${params.delay}秒发生${params.times}次)`,
    });
}

module.exports = Bark;
