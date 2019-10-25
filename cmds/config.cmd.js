const fs = require('fs'),
  { _readline } = require('../utils/promises');

module.exports = config;

function config(args) {
  const CONFIG_PATH = global.configPath, { name, path, ignore } = args;

  //verifico si existe el archivo de configuracion, si no existe lo creo.
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, '{}');
  }

  let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8') || '{}'),
    { environments = [] } = config;

  if (ignore) {
    config.ignore = ignore.split(',');
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...config }, null, 2));
  }

  if ((!name || !path) && !ignore) {
    console.log("ERROR: Debe definir un nombre <name> y una ruta <path> para la configuracion del ambiente");
    return;
  }

  let targetEnv = environments.find(e => name && e.name == name);

  if (targetEnv) {
    console.log('\nMSG: Ambiente configurado previamente');
    _readline('Quieres sobreescribir la configuración del ambiente? (y/n)')
      .then(answer => {

        if (answer == 'y') {
          targetEnv.path = path;
          fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...config, environments }, null, 2));
        }

        process.exit(1);
      });
    return;
  }

  environments.push({ name, path });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...config, environments }, null, 2));
}