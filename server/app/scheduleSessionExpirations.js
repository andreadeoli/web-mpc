const modelWrappers = require('../models/modelWrappers.js');

module.exports.start = function (jiffWrapper) {
  function stopSessions() {
    modelWrappers.SessionInfo.all().then(function (data) {
      for (let i = 0; i < data.length; i++) {
        let sessionInfo = data[i];
        if (sessionInfo.status !== 'STOP' && Date.parse(sessionInfo.time) < Date.now()) {
          sessionInfo.status = 'STOP';
          modelWrappers.SessionInfo.update(sessionInfo).then(() =>
            jiffWrapper.computeSession(sessionInfo.session));
        }
      }
    });
  }

  setInterval(stopSessions, 2000);
};
