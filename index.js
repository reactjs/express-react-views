/*
 *  Copyright (c) 2014, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
var React = require('react'),
  _merge = require('lodash.merge'),
  browserify = require('browserify'),
  literalify = require('literalify'),
  reactify    = require('reactify'),
  nodeJSX = require('node-jsx'),
  Stream = require('stream'),
  reactString = new Stream,
  uglifyify = require('uglifyify'),
  crypto = require('crypto'),
  cacheHash = {};

reactString.writable = true;

var DEFAULT_OPTIONS = {
  jsx: {
    extension: '.jsx',
    harmony: false
  },
  doctype: '<!DOCTYPE html>',
  beautify: false
};

function createEngine(engineOptions) {
  engineOptions = _merge(DEFAULT_OPTIONS, engineOptions);
  nodeJSX.install(engineOptions.jsx);

  function renderFile(filename, options, cb) {
    // Create hash based on filename + options unique pair.
    var shasum = crypto.createHash('sha1');
    var optionsString = JSON.stringify(options);
    shasum.update(filename + optionsString);
    var hash = shasum.digest('hex');

    if (!cacheHash[hash]) {
      try {
        var script = markup = '';
        var component = require(filename);
        component = React.createFactory(component);
        markup = engineOptions.doctype;
        markup += '<html><head></head><body id="body">';
        markup += React.renderToString(component(options));
        var b = browserify();
        b.require(filename, {expose: 'MyApp'})
          .transform(reactify)
          .transform({global: true}, literalify.configure({react: 'window.React'}))
          .transform({global: true}, uglifyify)
          .bundle().pipe(reactString);

        reactString.write = function (buf) {
          script += buf.toString();
        };
        reactString.end = function (buf) {
          if (arguments.length) {
            reactString.write(buf);
          }
          if (script.length) {
            markup += '<script src=//fb.me/react-0.12.2.min.js></script>';
            markup += '<script>' + script +
            'var MyApp = React.createFactory(require("MyApp"));' +
            'React.render(MyApp(' + safeStringify(options) + '), document.getElementById("body"))' +
            '</script>';
            markup += '</body></html>'
          }
          reactString.writable = false;

          // Add to cache.
          cacheHash[hash] = markup;
          cb(null, markup);
        };
        reactString.destroy = function () {
          reactString.writable = false;
        }
      } catch (e) {
        return cb(e);
      }
    } else {
      cb(null, cacheHash[hash]);
    }
  }
  return renderFile;
}
function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

exports.createEngine = createEngine;
