const pmx = require('pmx');
const init = require('./init');

/**
 *  Module Entry Point
 */
pmx.initModule({
  // Options related to the display style on Keymetrics
  widget: {
    // Logo displayed
    logo: 'https://app.keymetrics.io/img/logo/keymetrics-300.png',
    // Module colors
    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme: ['#141A1F', '#222222', '#3ff', '#3ff'],
    // Section to show / hide
    el: {
      probes: true,
      actions: true
    },
    // Main block to show / hide
    block: {
      actions: false,
      issues: true,
      meta: true,
      // Custom metrics to put in BIG
      main_probes: ['test-probe']
    }
  }
}, function (err, conf) {
  if (err) throw err;
  init(conf)
  // 保证进程挂起,不退出
  setInterval(function () { }, 3000);
});