"use strict";

var chai = require('chai');
chai.config.includeStack = true;

var shallowDeepEqual = require('../chai-shallow-deep-equal');
chai.use(shallowDeepEqual);

describe('chai-shallow-deep-equal', function() {

    chai.use(function (chai, utils) {
        var inspect = utils.objDisplay;

        chai.Assertion.addMethod('fail', function (message) {
            var obj = this._obj;

            new chai.Assertion(obj).is.a('function');

            try {
                obj();
            } catch (err) {
                this.assert(
                        err instanceof chai.AssertionError
                    , 'expected #{this} to fail, but it threw ' + inspect(err));
                this.assert(
                        err.message === message
                    , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
                return;
            }

            this.assert(false, 'expected #{this} to fail');
        });
    });

    it('success on scalar values', function() {
        new chai.Assertion(true).to.be.shallowDeepEqual(true);
        new chai.Assertion(10).to.be.shallowDeepEqual(10);
        new chai.Assertion('success').to.be.shallowDeepEqual('success');
    });

    it('fail on scalar values', function() {
        new chai.Assertion(function() {
            new chai.Assertion(true).to.be.shallowDeepEqual(false);
        }).fail('Expected to have "false" but got "true" at path "/".');

        new chai.Assertion(function() {
            new chai.Assertion(10).to.be.shallowDeepEqual(42);
        }).fail('Expected to have "42" but got "10" at path "/".');

        new chai.Assertion(function() {
            new chai.Assertion('success').to.be.shallowDeepEqual('fail');
        }).fail('Expected to have "fail" but got "success" at path "/".');
    });

    it('success on empty objects', function() {
        new chai.Assertion({}).to.be.shallowDeepEqual({});
    });

    it('success on empty array', function() {
        new chai.Assertion([]).to.be.shallowDeepEqual([]);
    });

    it('success on simple objects', function() {
        new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepEqual({a: 10});
    });

    it('fail on simple objects', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepEqual({a: 11});
        }).fail('Expected to have "11" but got "10" at path "/a".');
    });

    it('success on array', function() {
        new chai.Assertion([10,11,12]).to.be.shallowDeepEqual([10,11]);
    });

    it('fail on array', function() {
        new chai.Assertion(function() {
            new chai.Assertion([10,11,12]).to.be.shallowDeepEqual([13]);
        }).fail('Expected to have "13" but got "10" at path "/0".');
    });

    it('success on deep objects', function() {
        new chai.Assertion({a: {b: 12, c: 15}}).to.be.shallowDeepEqual({a: {b: 12}});
    });

    it('fail on deep objects', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: {b: 12, c: 15}}).to.be.shallowDeepEqual({a: {b: 13}});
        }).fail('Expected to have "13" but got "12" at path "/a/b".');
    });

    it('success on deep array', function() {
        new chai.Assertion([{b: 12, c: 15}]).to.be.shallowDeepEqual([{b: 12}]);
    });

    it('fail on deep array', function() {
        new chai.Assertion(function() {
            new chai.Assertion([{b: 12, c: 15}]).to.be.shallowDeepEqual([{b: 13}]);
        }).fail('Expected to have "13" but got "12" at path "/0/b".');
    });

    it('success on using object as array', function() {
        new chai.Assertion([{b: 12}, {c: 15}]).to.be.shallowDeepEqual({length: 2, 0: {b: 12}});
    });

    it('fail on using object as array', function() {
        new chai.Assertion(function() {
            new chai.Assertion([{b: 12}, {c: 15}]).to.be.shallowDeepEqual({length: 3});
        }).fail('Expected to have "3" but got "2" at path "/length".');
    });

    it('success on accessors', function() {
        function test() { }
        Object.defineProperty(test.prototype, 'a', {
            get: function() {
                return 'b';
            }
        });

        new chai.Assertion(new test()).to.be.shallowDeepEqual({ a: 'b' });
    });

    it('success on dates', function() {
        new chai.Assertion(new Date("2014-09-30T20:00:00.000Z"))
            .to.be.shallowDeepEqual(new Date("2014-09-30T20:00:00.000Z"));
    });

    it('fail on dates', function() {
        new chai.Assertion(function() {
            new chai.Assertion(new Date('2014-09-30T20:00:00.000Z'))
                .to.be.shallowDeepEqual(new Date('2014-09-29T20:00:00.000Z'));
        }).fail(
            'Expected to have date "2014-09-29T20:00:00.000Z" but got "2014-09-30T20:00:00.000Z" at path "/".'
        );
    });

    it('fail on comparsion date with non-date', function() {
      new chai.Assertion(function() {
          new chai.Assertion(42)
              .to.be.shallowDeepEqual(new Date('2014-09-29T20:00:00.000Z'));
      }).fail(
          'Expected to have date "2014-09-29T20:00:00.000Z" but got "42" at path "/".'
      );
    });

    it('success on missing properties', function() {
        new chai.Assertion({a: 10}).to.be.shallowDeepEqual({a: 10, b: undefined});
    });

    it('success on null properties', function() {
        new chai.Assertion({a: 10, b: null}).to.be.shallowDeepEqual({a: 10, b: null});
    });

    it('fail on missing properties', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepEqual({a: 10, b: undefined});
        }).fail('Expected to have undefined but got "12" at path "/b".');
    });

    it('fail on null properties', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepEqual({a: 10, b: null});
        }).fail('Expected to have null but got "12" at path "/b".');
    });

    it('success on null', function() {
        new chai.Assertion(null).to.be.shallowDeepEqual(null);
    });

    it('success on undefined', function() {
        var a = {};
        new chai.Assertion(a.unknown).to.be.shallowDeepEqual(undefined);
    });

    it('success on undefined sub-field', function() {
        var a = {};
        new chai.Assertion(a).to.be.shallowDeepEqual({b: undefined});
    });

    it('fail on undefined sub-field', function() {
        new chai.Assertion(function() {
            var a = { b: null };
            new chai.Assertion(a).to.be.shallowDeepEqual({b: undefined});
        }).fail('Expected to have undefined but got "null" at path "/b".');
    });

    it('fail on undefined array sub-field', function() {
        new chai.Assertion(function() {
            var a = { };
            new chai.Assertion(a).to.be.shallowDeepEqual({ b: [ ] });
        }).fail('Expected "b" field to be defined at path "/".');
    });

    it('fail on undefined item in array', function() {
        new chai.Assertion(function() {
            var a = { b: [ ] };
            new chai.Assertion(a).to.be.shallowDeepEqual({ b: [ { c: 'hello' } ] });
        }).fail('Expected "0" field to be defined at path "/b".');
    });

    it('fail on null', function() {
        new chai.Assertion(function() {
            new chai.Assertion(23).to.be.shallowDeepEqual(null);
        }).fail('Expected to have null but got "23" at path "/".');
    });

    it('fail on undefined', function() {
        new chai.Assertion(function() {
            new chai.Assertion(23).to.be.shallowDeepEqual(undefined);
        }).fail('Expected to have undefined but got "23" at path "/".');
    });

    it('fail on null sub-field', function() {
        new chai.Assertion(function() {
            var a = { b: 'abc' };
            new chai.Assertion(a).to.be.shallowDeepEqual({b: null});
        }).fail('Expected to have null but got "abc" at path "/b".');
    });

    it('fail on null array sub-field', function() {
        new chai.Assertion(function() {
            var a = { b: null };
            new chai.Assertion(a).to.be.shallowDeepEqual({ b: [ ] });
        }).fail('Expected to have an array/object but got null at path "/b".');
    });

    it('fail on null item in array', function() {
        new chai.Assertion(function() {
            var a = { b: [ null ] };
            new chai.Assertion(a).to.be.shallowDeepEqual({ b: [ { c: 'hello' } ] });
        }).fail('Expected to have an array/object but got null at path "/b/0".');
    });

    it('fail on unexisting array', function() {
        new chai.Assertion(function() {
            new chai.Assertion(null).to.be.shallowDeepEqual(['a']);
        }).fail('Expected to have an array/object but got null at path "/".');
    });

});
