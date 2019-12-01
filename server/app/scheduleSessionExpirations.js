const modelWrappers = require('../models/modelWrappers.js');
const moment = require('moment-timezone');

module.exports.start = function (jiffWrapper) {
  function stopSessions() {
    modelWrappers.SessionInfo.all().then(function (data) {
      for (let i = 0; i < data.length; i++) {
        let sessionInfo = data[i];
        let sessionExpirationUTC = sessionInfo.time.getTime() + 5 * 60 * 60 * 1000;
        if (sessionInfo.status !== 'STOP' && sessionExpirationUTC < Date.now()) {
          sessionInfo.status = 'STOP';
          modelWrappers.SessionInfo.update(sessionInfo).then(() =>
            jiffWrapper.computeSession(sessionInfo.session));
        }
      }
    });
  }

  setInterval(stopSessions, 2000);
};
