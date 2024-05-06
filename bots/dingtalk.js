const axios = require('axios');

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
    if (global.debug) console.log('钉钉待发送', urls)
    const title = `进程: ${params.name} ${params.id}(${params.delay}秒发生${params.times}次)`
    for (const url of urls) {
        if (!url) continue
        const u = new URL(url);
        axios.post(url, {
            msgtype: 'markdown',
            markdown: {
                title,
                text: `**${title}**\n> ${params.msg}`
            }
        }).then(console.log).catch(console.error)
    }
}
