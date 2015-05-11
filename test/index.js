var assert = require('assert');
var async = require('async');
var viewEngine = require('..');
var viewOptions = {
  settings: {
    env: 'development',
    views: __dirname
  }
};

function testComponent(path, cb) {
  var render = viewEngine.createEngine();
  render(__dirname + '/es5-component.jsx', viewOptions, function(err, source) {
    assert(!err);
    assert(source.indexOf('I can count to 10:1, 2, 3, 4, 5, 6, 7, 8, 9, 10') !== -1);
    cb();
  });
}

async.series([
  function testES5Module(next) {
    testComponent(__dirname + '/es5-component.jsx', next);
  },
  function testES6Module(next) {
    testComponent(__dirname + '/es6-component.jsx', next);
  },
  function testES6FlowModule(next) {
    testComponent(__dirname + '/es6-flow-component.jsx', next);
  }
], function done() {
  console.log('All tests pass!');
  process.exit(0);
});

