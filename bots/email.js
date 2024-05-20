const nodemailer = require('nodemailer');

var transporter;

// mail://username:passowrd@mail.163.com:533
// https://nodemailer.com/
/**
 * 
 * @param {String} smtp
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
module.exports = function send(smtp, emails, params) {
    if (!smtp) return;
    var u = doinit(smtp);
    if (global.debug) console.log('邮件待发送', emails, params)
    transporter.sendMail({
        from: `"pm2-notify-x" <${u.auth.user}>`, // sender address
        to: (emails || []).filter(v => v).join(', '), // list of receivers
        subject: `进程名: ${params.name} ${params.id}`, // Subject line
        html: `<h4>${params.time} (${params.delay}秒发生${params.times}次)</h4><p>${params.msg}</p>`, // html body
    }).catch(console.error);
}

function doinit(smtp) {
    var u = new URL(smtp)
    var opts = {
        host: u.hostname,
        port: u.port,
        secure: u.port == 465, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: decodeURIComponent(u.username),
            pass: u.password,
        },
    }
    if (global.debug) console.log(opts)
    transporter = nodemailer.createTransport(opts);
    return opts
}