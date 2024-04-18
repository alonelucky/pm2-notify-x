const pm2 = require('pm2');
const dayjs = require('dayjs');
const wxwork = require('./wxwork_bot');
const bark = require('./bark');
const { md5 } = require('./lib');

const cache = {}
let currentPmID = -1;
global.debug = false;

/**
 * 入口
 * @param {object} conf 
 * @param {object} conf.module_conf
 */
module.exports = function (conf) {
    global.debug = conf.module_conf.debug;
    if (global.debug) console.log(conf.module_conf)
    const wxworks = conf.module_conf.wxwork.split(',') || [];
    const barks = conf.module_conf.bark.split(',') || [];
    const pmnamewxworks = {};
    const pmnamebarks = {};
    for (let key in (conf.module_conf || {})) {
        var keys = key.split('_');
        if (keys.length === 1) continue;
        var k = keys.slice(0, keys.length - 1).join('_');
        if (keys[keys.length - 1] === 'wxwork') {
            pmnamewxworks[k] = [...(pmnamewxworks[k] || []), conf.module_conf[key]]
            continue
        }

        if (keys[keys.length - 1] === 'bark') {
            pmnamebarks[k] = [...(pmnamebarks[k] || []), conf.module_conf[key]]
            continue
        }
    }

    if (global.debug) console.log({ pmnamebarks, pmnamewxworks, wxworks, barks })
    const delay = Number(conf.delay) || 15;
    // 获取当前进程pm_id
    pm2.list((err, list) => {
        if (err) throw err;
        for (let item of list) {
            if (item.name == conf.module_name) {
                currentPmID = item.pm_id;
            }
        }
    })

    pm2.launchBus((err, bus) => {
        if (err) throw err; // 如果启动错误,则直接抛出错误

        bus.on('log:*', (type, info) => {
            if (info.process.pm_id == currentPmID || currentPmID < 0) return; // 如果是当前进程的错误,则不处理,有可能会造成递归

            switch (type) {
                case 'err':
                    let key = md5(info.process.name + JSON.stringify(info.data))
                    if (cache[key]) return cache[key].times += 1;
                    cache[key] = {
                        name: info.process.name,
                        id: info.process.pm_id,
                        time: dayjs(info.at).format('YYYY-MM-DD HH:mm:ss'),
                        msg: info.data,
                        times: 1,
                        delay,
                    };
                    setTimeout(() => {
                        wxwork([...(pmnamewxworks[info.process.name] ?? []), ...wxworks], cache[key]);
                        bark([...(pmnamebarks[info.process.name] ?? []), ...barks], cache[key]);
                        cache[key] = undefined;
                    }, delay * 1000)
                    break;
            }
        })
    });
}