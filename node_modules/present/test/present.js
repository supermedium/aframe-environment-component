#!/usr/bin/env node
/*global require*/
var test = require('tape');
var present = require('..');

var epsilon = 10; // has to be this high or tests fail

function assertWithin (t, val, expected, range) {
  t.ok(val >= expected - range, "val >= expected - range");
  t.ok(val <= expected + range, "val <= expected + range");
}

function assertDifferenceAfter (t, n) {
  var start = present();
  setTimeout(function () {
    assertWithin(t, present() - start, n, epsilon);
  }, n);
}

test("present", function (t) {
  t.test("should be n greater after n ms", function (st) {
    var ns = [0, 1, 10, 100];
    st.plan(ns.length * 2);

    while (ns.length) {
      assertDifferenceAfter(st, ns.shift());
    }
  });
});
