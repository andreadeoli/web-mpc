const modelWrappers = require('../models/modelWrappers');
const forge = require('node-forge');

function registerVote(session_id, userkey) {
  modelWrappers.SessionInfo.get(session_id, null).then(data => {
    let publicKey = forge.pki.publicKeyFromPem(data.pub_key);
    let toEncrypt =  Buffer.from(userkey, 'utf8');
    let encrypted = publicKey.encrypt(toEncrypt, 'RSA-OAEP', { md: forge.md.sha256.create() });
    return modelWrappers.VotingRecord.insert(session_id, encrypted);
  });
}

module.exports = {
  beforeOperation: async function (jiff, operation, computation_id, party_id, msg) {
    if (operation === 'poll' && msg !== null && 'initialization' in msg && 'userkey' in msg.initialization) {
      registerVote(msg.computation_id, msg.initialization.userkey);
    }
    return msg;
  }
};
