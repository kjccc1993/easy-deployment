const readline = require('readline');

module.exports = {
  _readline
};

function _readline(question) {

  return new Promise(function (resolve) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question + '\n', answer => {
      rl.close();
      return resolve(answer);
    });
  });
}