var path = require('path');

var createPattern = function (file) {
    return {pattern: file, included: true, served: true, watched: false};
};

var initAdapter = function (files) {
    var _path = path.dirname(require.resolve('chai-shallow-deep-equal'));
    var pluginFile = createPattern(_path + '/chai-shallow-deep-equal.js');

    var chaiFileIndex = -1;
    for (var i = 0; i < files.length; i++) {
        if (files[i].pattern.match(/chai\.js$/i)) {
            chaiFileIndex = i;
            break;
        }
    }

    var pluginIndex = chaiFileIndex + 1;
    files.splice(pluginIndex, 0, pluginFile);
    console.log(files);
};

initAdapter.$inject = ['config.files'];

module.exports = {
    'framework:chai-shallow-deep-equal': ['factory', initAdapter]
};
