const axios = require('axios');

// https://open.feishu.cn/document/common-capabilities/message-card/message-cards-content/card-structure/card-content
// https://open.feishu.cn/document/common-capabilities/message-card/message-cards-content/using-markdown-tags
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
    if (global.debug) console.log('飞书 待发送', urls)
    const title = `进程: ${params.name} ${params.id}(${params.delay}秒发生${params.times}次)`
    for (const url of urls) {
        if (!url) continue
        const u = new URL(url);
        axios.post(url, {
            msg_type: 'interactive',
            card: {
                elements: [
                    {
                        tag: "markdown",
                        content: `<font color='grey'>${params.msg}</font>`,
                    },
                ],
                header: {
                    title: {
                        content: title,
                        tag: "plain_text"
                    }
                }
            }
        }).catch(console.error)
    }
}
