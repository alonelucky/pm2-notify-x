const axios = require('axios');

// https://core.telegram.org/bots/api#formatting-options
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
    if (global.debug) console.log('Telegram 待发送', urls)
    const title = `进程: ${params.name} ${params.id}(${params.delay}秒发生${params.times}次)`
    for (const url of urls) {
        if (!url) continue
        const u = new URL(url);
        axios.post(url, {
            chat_id: u.searchParams.get('chat_id'),
            text: `<b>${title}</b>\n<pre><code>${params.msg.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/&/g, '&amp;')}</code></pre>`,
            parse_mode: 'HTML'
        }).catch(console.error)
    }
}
