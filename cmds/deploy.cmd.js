const fs = require('fs'),
  shell = require('shelljs'),
  ora = require('ora'),
  { _readline } = require('../utils/promises');

module.exports = deploy;

function deploy(args) {

  const CONFIG_PATH = global.configPath,
    { from, to, p } = args;

  //Verifico si existe el archivo de configuracion.
  if (!fs.existsSync(CONFIG_PATH)) {
    console.log('ERROR: no such configuration file, use <easy-deployment config> command to create');
    process.exit(1);
  }

  let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8') || '{}'),
    { environments = [] } = config, fromEnv, toEnv;

  if (!to) {
    console.log("ERROR: you must define the target <to>");
    return;
  }

  if (!from && !p) {
    console.log("ERROR: you must define the origin <from>");
    return;
  }

  //Busco los ambientes
  environments.forEach(e => {
    if (e.name == from) {
      fromEnv = e;
    }

    if (e.name == to) {
      toEnv = e;
    }
  });

  //si tengo el repo destino y la bandera p, solo se quiere hacer commit y push
  if (toEnv && p) {
    launch();
    return;
  }

  if (!fromEnv || !toEnv) {
    console.log(`ERROR: ${!fromEnv ? "origin <from>" : "target <to>"} environment not found`);
    return;
  }

  if (fromEnv.runBefore) {
    const msg = '\n> ' + fromEnv.runBefore.join('\n> ');
    _readline('Do you want to run previous commands? (y/n)' + msg)
      .then(answer => {

        if (answer == 'y') {
          //Si no se específica la ruta raiz del repo en la configuración se toma la misma ruta targetPath
          shell.cd(fromEnv.rootPath ? fromEnv.rootPath : fromEnv.targetPath);
          fromEnv.runBefore.forEach(shell.exec);
        }

        return Promise.resolve('listo');
      })
      .then(() => launch());
  } else {
    launch();
  }

  function copyFiles() {
    const spinner = ora({ text: "Copying files..." }).start();

    //Verifico si existe el archivo de configuracion.
    if (!fs.existsSync(fromEnv.targetPath)) {
      spinner.stop();
      console.log('ERROR: especified path does not exist ' + fromEnv.targetPath);
      process.exit(1);
    }

    //Copio los archivos, excluyendo los del ignore
    let dir = fs.readdirSync(fromEnv.targetPath).filter(e => fromEnv.ignore ? !fromEnv.ignore.includes(e) : true);
    dir.forEach(e => shell.cp('-r', fromEnv.targetPath + '/' + e, toEnv.targetPath));
    spinner.stop();
    console.log("MSG: files successfully copied");
  }

  function launch() {
    if (!p)
      copyFiles();

    //Si no se específica la ruta raiz del repo en la configuración se toma la misma ruta targetPath
    shell.cd(toEnv.rootPath ? toEnv.rootPath : toEnv.targetPath);

    //Muestro los cambios para confirmación
    let gitStatus = shell.exec('git status');

    //si no hay nada para el commit, return
    if (gitStatus.stdout.match(/nothing to commit/))
      return;

    _readline('Do you confirm changes? (y/n)')
      .then(answer => {
        if (answer == 'y') {
          shell.exec('git add .');
          shell.exec(`git commit -am Lanzamiento_a_${toEnv.alias || 'development'}_${(new Date()).toLocaleString().replace(' ', '_')}`);
          shell.exec('git push');
          return process.exit(1);
        }

        shell.exec('git reset --hard');
        process.exit(1);
      });
  }
}
