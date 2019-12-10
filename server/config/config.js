let deployment = process.env.WEBMPC_DEPLOYMENT;
if (deployment === null || deployment === undefined) {
  deployment = 'election';
}

module.exports = require('./' + deployment + '.json');
