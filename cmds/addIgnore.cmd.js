const fs = require('fs');

module.exports = addIgnore;

function addIgnore(args) {
  let CONFIG_PATH = global.configPath, { ignore, name } = args;

  //Verifico si existe el archivo de configuracion.
  if (!fs.existsSync(CONFIG_PATH)) {
    console.log('ERROR: no such configuration file, use <easy-deployment config> command to create');
    return process.exit(1);
  }

  let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8') || '{}'),
    { environments = [] } = config,
    targetEnv = environments.find(e => name && e.name == name);

  if (!name || !ignore) {
    console.log("ERROR: you must define name <name> and ignore <ignore>");
    return;
  }

  if (!targetEnv) {
    console.log("ERROR: environment " + name + "not found");
    return;
  }

  ignore = ignore.split(',');
  if (!targetEnv.ignore) {
    targetEnv.ignore = ignore;
  } else {
    ignore.forEach(ig => targetEnv.ignore.includes(ig) ? '' : targetEnv.ignore.push(ig));
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...config, environments }, null, 2));
}