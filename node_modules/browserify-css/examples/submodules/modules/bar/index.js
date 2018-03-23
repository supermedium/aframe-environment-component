'use strict';

module.exports = {
    init: function() {
        var container = document.getElementById('container');
        var bar = document.createElement('div');
        bar.setAttribute('class', 'bar');
        bar.innerHTML = 'bar module';
        container.appendChild(bar);
    }
};
