const pm2 = require('pm2');
const pmx = require('pmx');
const dayjs = require('dayjs');
const text2png = require('text2png');
const WxWorkBot = require('./wxwork_bot');

let currentPmID = -1;
/**
 *           Module Entry Point
 */
pmx.initModule({

  // Options related to the display style on Keymetrics
  widget : {

    // Logo displayed
    logo : 'https://app.keymetrics.io/img/logo/keymetrics-300.png',

    // Module colors
    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme            : ['#141A1F', '#222222', '#3ff', '#3ff'],

    // Section to show / hide
    el : {
      probes  : true,
      actions : true
    },

    // Main block to show / hide
    block : {
      actions : false,
      issues  : true,
      meta    : true,

      // Custom metrics to put in BIG
      main_probes : ['test-probe']
    }

  }

}, function(err, conf) {
  if (err) throw err;
  console.log(conf);

  let wxwork = new WxWorkBot(conf);

  // 获取当前进程pm_id
  pm2.list((err, list)=>{
    if (err) throw err;
    for (let item of list){
      if (item.name == conf.module_name) {
        currentPmID = item.pm_id;
      }
    }
  })

  pm2.launchBus((err,bus)=>{
    if (err) throw err; // 如果启动错误,则直接抛出错误

    bus.on('log:*',(type, info)=>{

      if (info.process.pm_id == currentPmID || currentPmID <  0) return; // 如果是当前进程的错误,则不处理,有可能会造成递归
      
      // 数据整理
      info.data = `\n进程名称: ${info.process.name} , 进程ID: ${info.process.pm_id} 发生时间: ${dayjs(info.at).format('YYYY-MM-DD HH:mm:ss')}\n\n` +  info.data;

      switch(type){
        case 'err':
            let imgBuf = text2png(info.data || '未知错误');
            wxwork.send({isAll: false, img: imgBuf});
          break;
      }
    })
  });

  // 保证进程挂起,不退出
  setInterval(function() {}, 3000);
});
