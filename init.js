const pm2 = require('pm2');
const dayjs = require('dayjs');
const { get } = require('radash');
const wxwork = require('./bots/wxwork_bot');
const bark = require('./bots/bark');
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
    global.debug = conf.module_conf.debug || false;
    if (global.debug) console.log(conf.module_conf)
    const delay = Number(conf.module_conf.delay) || 15;
    const globalfind = parseFind(conf.module_conf.find);
    const wxworks = (conf.module_conf.wxwork || '').split(',') || [];
    const barks = (conf.module_conf.bark || '').split(',') || [];
    const pmnamewxworks = {};
    const pmnamebarks = {};
    const pnamefind = {};
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

        if (keys[keys.length - 1] === 'find') {
            pnamefind[k] = parseFind(conf.module_conf[key])
            continue
        }
    }

    if (global.debug) console.log({ pmnamebarks, pmnamewxworks, wxworks, barks })
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

        bus.on('log:err', (info) => {
            if (info.process.pm_id == currentPmID || currentPmID < 0) return; // 如果是当前进程的错误,则不处理,有可能会造成递归
            let find = pnamefind[info.process.name] || globalfind;
            let data = extra(find, info.data);
            if (!data) return;

            let key = md5(info.process.name + JSON.stringify(data))
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
                wxwork([...(pmnamewxworks[info.process.name] || []), ...wxworks], cache[key]);
                bark([...(pmnamebarks[info.process.name] || []), ...barks], cache[key]);
                cache[key] = undefined;
            }, delay * 1000)
        })
    });
}

function extra(find, data) {
    try {
        if (!find) return data;
        if (typeof find === "string") {
            let obj = JSON.parse(data)
            let msg = get(obj, find)
            if (msg) return msg;
            return data; // 如果没有找到对应的 key 则返回全部对象
        } else if (find.test(data)) {
            return data // 如果正则匹配则返回整条信息, 正则不匹配的信息不做通知
        }
    } catch (e) {
        if (global.debug) console.log(e)
    }
}

/**
 * 
 * @param {string} find 
 * @returns 
 */
function parseFind(find) {
    if (!find) return null;
    if (find[0] === '$') {
        return find.substring(2)
    }

    if (/^\/.*\/[igmu]*$/i.test(find)) {
        return eval(find)
    }
    return new RegExp(find)
}