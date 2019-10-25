const minimist = require('minimist'),
  configCmd = require('./cmds/config.cmd'),
  deployCmd = require('./cmds/deploy.cmd');

global.__base = __dirname;
global.configPath = __dirname + '/config.cfg';

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  console.log(args);
  let [cmd] = args._ || 'help';

  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  }

  switch (cmd) {
    case 'config':
      configCmd(args);
      break;

    case 'deploy':
      deployCmd(args);
      break;

    default:
      console.error(`"${cmd}" is not a valid command!`);
      break;
  }
}