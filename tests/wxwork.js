const wxwork = require('../bots/wxwork_bot');

wxwork([process.env.NOTIFITY_URL], {
    name: 'test-process',
    id: 'pid1234',
    time: new Date(),
    msg: `Error: Request failed with status code 400
    at createError (/Users/xiaqiubo/Desktop/test/js/pm2-notify-x/node_modules/axios/lib/core/createError.js:16:15)
    at settle (/Users/xiaqiubo/Desktop/test/js/pm2-notify-x/node_modules/axios/lib/core/settle.js:17:12)
    at IncomingMessage.handleStreamEnd (/Users/xiaqiubo/Desktop/test/js/pm2-notify-x/node_modules/axios/lib/adapters/http.js:236:11)
    at IncomingMessage.emit (events.js:412:35)
    at endReadableNT (internal/streams/readable.js:1333:12)
    at processTicksAndRejections (internal/process/task_queues.js:82:21)`,
    times: 1,
    delay: 15
})