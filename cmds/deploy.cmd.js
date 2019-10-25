const fs = require('fs'),
  shell = require('shelljs'),
  { _readline } = require('../utils/promises');

module.exports = deploy;

function deploy(args) {

  const CONFIG_PATH = global.configPath,
    { from, to } = args;

  //verifico si existe el archivo de configuracion, si no existe lo creo.
  if (!fs.existsSync(CONFIG_PATH)) {
    console.log('No hay archivo de configuración');
    process.exit(1);
  }

  let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8') || '{}'),
    { environments = [], ignore } = config, fromPath, toPath;

  environments.forEach(e => {
    if (e.name == from) {
      fromPath = e.path;
    }

    if (e.name == to) {
      toPath = e.path;
    }
  });

  let dir = fs.readdirSync(fromPath).filter(e => !ignore.includes(e));
  dir.forEach(e => shell.cp('-r', fromPath + '/' + e, toPath));

}
