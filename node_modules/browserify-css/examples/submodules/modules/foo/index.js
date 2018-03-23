'use strict';

module.exports = {
    init: function() {
        var container = document.getElementById('container');
        var foo = document.createElement('div');
        foo.setAttribute('class', 'foo');
        foo.innerHTML = 'foo module';
        container.appendChild(foo);
    }
};
