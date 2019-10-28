# easy-deployment

## Installation
`npm i -g easy-deployment`

## Commands
### `config <options>`

Environments configuration

- name: environment name
- alias (optional): environment alias, to be used in commits
- targetPath: location of files to be copied 
- ignore (optional): separated by commas string with files or folders to be ignored, eg: "node_modules,.git"
- runBefore (optional): separated by commas string with commands to be executed before the copy, eg: "npm test"
- rootPath: root path of repository, to be used while running previous commands (runBefore option)

### `deploy`

deploy launching from one environment to another

- from (optional): source environment name, required if not use '--p'
- to: target environment name
- p: flag to make only commit and push 
