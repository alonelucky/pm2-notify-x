const axios = require('axios');
const baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=';

// 发送机器人消息
/**
 * 
 * @param {Array<String>} keys
 * @param {object} params 
 * @param {String} params.name
 * @param {Number} params.id
 * @param {String} params.time
 * @param {String} params.msg
 * @param {String} params.times 单位时间内触发次数
 * @param {String} params.delay 延迟触发间隔
 * @returns 
 */
module.exports = function send(keys, params) {
    if (global.debug) console.log('企微待发送', keys)
    for (const key of keys) {
        if (!key) continue
        axios.post(baseUrl + key, {
            msgtype: 'markdown',
            markdown: {
                content: `**进程名: ${params.name} ${params.id}**
<font color="comment">${params.time} (${params.delay}秒发生${params.times}次)</font>
> ${params.msg}`
            },
        }).catch(console.error)
    }
}
