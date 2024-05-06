const pm2 = require('pm2');
const dayjs = require('dayjs');
const { get } = require('radash');
const wxwork = require('./bots/wxwork_bot');
const bark = require('./bots/bark');
const dingtalk = require('./bots/dingtalk');
const flybook = require('./bots/flybook');
const slack = require('./bots/slack');
const telegram = require('./bots/telegram');
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

    const botCofnig = new ModelConfig(conf.module_conf);

    if (global.debug) console.log(botCofnig)
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
            let find = botCofnig.get(info.process.name, 'find') || botCofnig.find;
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
                wxwork(botCofnig.get(info.process.name, 'wxwork'), cache[key]);
                bark(botCofnig.get(info.process.name, 'bark'), cache[key]);
                dingtalk(botCofnig.get(info.process.name, 'dingtalk'), cache[key]);
                flybook(botCofnig.get(info.process.name, 'feishu'), cache[key]);
                slack(botCofnig.get(info.process.name, 'slack'), cache[key]);
                telegram(botCofnig.get(info.process.name, 'telegram'), cache[key]);
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
        return data
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

class ModelConfig {
    find;
    conf = {};
    data = {};
    types = ['wxwork', 'bark', 'slack', 'feishu', 'dingtalk', 'telegram'];
    constructor(conf) {
        this.conf = conf || {};
        this.data.wxwork = (conf.wxwork || '').split(',') || [];
        this.data.bark = (conf.bark || '').split(',') || [];
        this.find = parseFind(conf.find);
        this._getAll();
    }

    _getAll() {
        for (let key in this.conf) {
            var keys = key.split('_');
            if (keys.length === 1) continue;
            var name = keys.slice(0, keys.length - 1).join('_');
            if (!this.data[name]) this.data[name] = {};
            var typ = keys[keys.length - 1];
            if (typ === 'find') {
                this.data[name][typ] = parseFind(this.conf[key])
                continue;
            }
            if (this.types.includes(typ)) {
                this.data[name][typ] = [...(this.data[name][typ] || []), this.conf[key]]
            }
        }
    }

    _getfind(name) {
        if (!this.data[name]) return this.find;
        return this.data[name]['find']
    }

    get(name, type) {
        if (type === 'find') return this._getfind(name);
        if (this.data[name] && this.data[name][type]) return this.data[name][type] || [];
        return this.data[type] || [];
    }
}