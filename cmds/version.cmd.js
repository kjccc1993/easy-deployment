const { version } = require('../package.json')
module.exports = versionCmd;

function versionCmd(args) {
  console.log(`v${version}`);
}