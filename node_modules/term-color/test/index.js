'use strict';

var test = require('tape');

var TermColor = require('../index.js');

test('using colors', function t(assert) {
    TermColor.enabled = true;
    assert.equal(TermColor.blue('foo'), '\x1b[34mfoo\x1b[39m');

    assert.end();
});

test('with colors disabled', function t(assert) {
    TermColor.enabled = false;
    assert.equal(TermColor.blue('foo'), 'foo');

    assert.end();
});
