const modelWrappers = require('../models/modelWrappers');

function registerVote(session_id, userkey) {
  return modelWrappers.VotingRecord.insert(session_id, userkey);
}

module.exports = {
  beforeOperation: async function (jiff, operation, computation_id, party_id, msg) {
    if (operation === 'poll' && msg !== null && 'initialization' in msg && 'userkey' in msg.initialization) {
      registerVote(msg.computation_id, msg.initialization.userkey);
    }
    return msg;
  }
};
