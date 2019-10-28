const menus = {
  main: `
    easy-deployment [command] <options>
    config .............. environments configuration
    deploy .............. deploy launching from one environment to another
    version ............. package version
    help ................ help`,
  config: `
    easy-deployment config <options>
    --name: environment name
    --alias (optional): environment alias, to be used in commits
    --targetPath: location of files to be copied 
    --ignore (optional): separated by commas string with files or folders to be ignored, eg: "node_modules,.git"
    --runBefore (optional): separated by commas string with commands to be executed before the copy, eg: "npm test"
    --rootPath: root path of repository, to be used while running previous commands (runBefore option)`,
  deploy: `
    easy-deployment deploy <options>
    --from .............. source environment name
    --to ................ target environment name
  `
};

module.exports = help;

function help(args) {

  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0];

  console.log(menus[subCmd] || menus.main);

}