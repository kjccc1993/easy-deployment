const fs = require('fs'),
  { _readline } = require('../utils/promises');

module.exports = config;

function config(args) {
  let CONFIG_PATH = global.configPath, { name, targetPath, ignore, alias, runBefore, rootPath } = args;

  //verifico si existe el archivo de configuracion, si no existe lo creo.
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, '{}');
  }

  let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8') || '{}'),
    { environments = [] } = config;

  let targetEnv = environments.find(e => name && e.name == name);

  if ((!name || !targetPath) && !targetEnv) {
    console.log("ERROR: you must define the name <name> and path <targetPath> to configure the environment");
    return;
  }

  if (ignore) {
    ignore = ignore.split(',');
  }

  if (targetEnv) {
    console.log('\nMSG: environment previosly configured');
    _readline('Do you want to overwrite the actual configuration? (y/n)')
      .then(answer => {

        if (answer == 'y') {
          targetEnv.targetPath = targetPath ? targetPath : targetEnv.targetPath;
          targetEnv.alias = alias ? alias : targetEnv.alias;
          targetEnv.runBefore = runBefore ? runBefore.split(',') : targetEnv.runBefore;
          targetEnv.rootPath = rootPath ? rootPath : targetEnv.rootPath;
          targetEnv.ignore = ignore ? ignore : targetEnv.ignore;
          fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...config, environments }, null, 2));
        }

        process.exit(1);
      });
    return;
  }

  environments.push({ name, alias, targetPath, rootPath, ignore, runBefore: runBefore ? runBefore.split(',') : undefined });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...config, environments }, null, 2));
}