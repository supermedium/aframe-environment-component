var util = require('util');


var DECLARATION = 'window.__env__ = window.__env__ || {};\n',
    TEMPLATE = function(name) {
      if (typeof process.env[name] !== 'undefined') {
        var tmpl = 'window.__env__[\'%s\'] = \'%s\';\n';
        return util.format(tmpl, name, process.env[name]);
      } else {
        return '';
      }
    };

var createEnvPreprocessor = function(args, config, logger, helper) {
  var log = logger.create('preprocessor.env'),
      names = config.envPreprocessor || [];
  log.info('Publishing variables: ', names);

  return function(content, file, done) {
    var envContent = DECLARATION;

    for (var i in names) {
      envContent += TEMPLATE(names[i]);
    }

    done(envContent + '\n' + content);
  };

};

module.exports = {
  'preprocessor:env': ['factory', createEnvPreprocessor]
};
