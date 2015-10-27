var assert = require('assert');
var async = require('async');
var viewEngine = require('..');
var viewOptions = {
  settings: {
    env: 'development',
    views: __dirname
  }
};

function getEngine(checksum){
  var options = checksum===true ? {checksum:true}:{};
  return viewEngine.createEngine(options);
}

function testComponent(path, cb, checksum) {
  var render = getEngine(checksum);
  render(path, viewOptions, function(err, source) {
    assert(!err);
    
    if(checksum){
      assert(source.indexOf('I can count to 10:</span>') !== -1 && source.indexOf('1, 2, 3, 4, 5, 6, 7, 8, 9, 10') !== -1);
    }else{
      assert(source.indexOf('I can count to 10:1, 2, 3, 4, 5, 6, 7, 8, 9, 10') !== -1);
    }
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
  },
  function testChecksumES5Module(next) {
    testComponent(__dirname + '/es5-component.jsx', next, true);
  },
  function testChecksumES6Module(next) {
    testComponent(__dirname + '/es6-component.jsx', next, true);
  },
  function testChecksumES6FlowModule(next) {
    testComponent(__dirname + '/es6-flow-component.jsx', next, true);
  }
], function done() {
  console.log('All tests pass!');
  process.exit(0);
});

