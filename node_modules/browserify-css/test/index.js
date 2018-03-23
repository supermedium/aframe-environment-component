'use strict';

var fs = require('fs');
var test = require('tap').test;
var browserify = require('browserify');
var concatStream = require('concat-stream');
var jsdom = require('jsdom');
var browserifyCSSTransform = require('../');

test('load style sheets at run time', function(t) {
    var b = browserify()
        .add('test/fixtures/submodules')
        .transform(browserifyCSSTransform)
        .require('./browser', {expose: 'browserify-css'})
        .bundle();

    b.pipe(concatStream(function(bundle) {
        var html = fs.readFileSync('./test/fixtures/submodules/index.html');
        jsdom.env({
            html: html,
            src: [
                fs.readFileSync('./test/fixtures/jquery.js'),
                bundle
            ],
            features: {
                FetchExternalResources: ['script'],
                ProcessExternalResources: ['script'],
                SkipExternalResources: false
            },
            done: function(errors, window) {
                if (errors) {
                    t.fail(errors);
                    return t.end();
                }

                var $ = window.jQuery;
                var $foo = $('#container .foo');
                var $bar = $('#container .bar');

                t.ok($foo.length > 0);
                t.equal($foo.text(), 'foo module', 'the inner text should be "foo module"');
                t.equal(window.getComputedStyle($foo.get(0))._values['background-color'], 'rgb(204, 204, 204)', 'the computed style of background-color property for the element should be #ccc');
                t.ok($bar.length > 0);
                t.equal($bar.text(), 'bar module', 'the inner text should be "bar module"');
                t.equal(window.getComputedStyle($bar.get(0))._values['background-color'], 'rgb(238, 238, 238)', 'the computed style of background-color property for the element should be #eee');

                t.end();
            }
        });
    }));
});
