var opts = {
  '--colors': true,
  '--reporter': 'spec'
};

module.exports = function(config) {
  // if the module that required this modules is the script being run, then run the tests:
  if (module.parent === require.main) {
    if(config) {
      // override configuration
      if(config['--no-colors']) {
        delete opts['--colors'];
      }
      Object.keys(config).forEach(function(key) {
        opts[key] = config[key];
      });
    }

    var line = [];
    Object.keys(opts).forEach(function(key) {
      if(typeof opts[key] == 'string') {
        line.push(key, opts[key]);
      } else {
        line.push(key);
      }
    });

    var mocha = require('child_process').spawn('mocha', line.concat(module.parent.filename));
    mocha.stderr.once('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
        console.log('Failed to start child process. You need mocha: `npm install -g mocha`');
      }
    });
    mocha.stdout.pipe(process.stdout);
    mocha.stderr.pipe(process.stderr);
    return true;
  }
  return false;
};

