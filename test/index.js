var assert = require('assert');
var async = require('async');
var viewEngine = require('..');
var viewOptions = {
  settings: {
    env: 'development',
    views: __dirname,
  },
};

function testComponent(path, cb) {
  var render = viewEngine.createEngine();
  render(path, viewOptions, function(err, source) {
    assert(!err, `Rendering ${path}: Did not throw`);
    assert.equal(
      source,
      '<!DOCTYPE html><div><h1></h1><p>Welcome to </p><p>I can count to 10:1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p></div>',
      `Rendering ${path}: generated expected content`
    );
    cb();
  });
}

async.series(
  [
    function testES5Module(next) {
      testComponent(__dirname + '/es5-component.jsx', next);
    },
    function testES6Module(next) {
      testComponent(__dirname + '/es6-component.jsx', next);
    },
    function testES6FlowModule(next) {
      testComponent(__dirname + '/es6-flow-component.jsx', next);
    },
  ],
  function done() {
    console.log('All tests pass!');
    process.exit(0);
  }
);
