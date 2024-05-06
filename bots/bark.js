const axios = require('axios');

// https://bark.day.app/#/tutorial?id=url%e6%a0%bc%e5%bc%8f

/**
 * 
 * @param {Array<String>} urls 
 * @param {object} params 
 * @param {String} params.name
 * @param {Number} params.id
 * @param {String} params.time
 * @param {String} params.msg
 * @param {String} params.times 单位时间内触发次数
 * @param {String} params.delay 延迟触发间隔
 * @returns 
 */
module.exports = function send(urls, params) {
    if (global.debug) console.log('Bark待发送', urls)
    for (const url of urls) {
        if (!url) continue
        axios.post(url, {
            body: params.msg,
            title: `进程: ${params.name} ${params.id}(${params.delay}秒发生${params.times}次)`,
        }).catch(console.error)
    }
}
