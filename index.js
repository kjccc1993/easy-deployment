const minimist = require('minimist'),
  shell = require('shelljs'),
  helpCmd = require('./cmds/help.cmd'),
  versionCmd = require('./cmds/version.cmd'),
  configCmd = require('./cmds/config.cmd'),
  addIgnoreCmd = require('./cmds/addIgnore.cmd'),
  deployCmd = require('./cmds/deploy.cmd');

global.__base = __dirname;
global.configPath = shell.exec('npm get prefix', { silent: true }).stdout.replace('\n', '') + '/easy-deploy-config.json';

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  //console.log(args);
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

    case 'add-ignore':
      addIgnoreCmd(args);
      break;

    case 'help':
      helpCmd(args);
      break;

    case 'version':
      versionCmd(args);
      break;

    default:
      console.error(`Invalid command!`);
      break;
  }
}