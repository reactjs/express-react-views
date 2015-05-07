/*
 *  Copyright (c) 2014, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var beautifyHTML = require('js-beautify').html;
var assign = require('object-assign');
var registered = false;

var DEFAULT_OPTIONS = {
  doctype: '<!DOCTYPE html>',
  beautify: false
};

function createEngine(engineOptions) {
  engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions || {});

  var moduleDetectRegEx;

  function renderFile(filename, options, cb) {
    // Defer babel registration until the first request so we can grab the view path.
    if (!registered) {
      moduleDetectRegEx = new RegExp('^' + options.settings.views);
      require('babel/register')({
        only: moduleDetectRegEx
      });
      registered = true;
    }

    try {
      var markup = engineOptions.doctype;
      var component = require(filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
      markup +=
        React.renderToStaticMarkup(React.createElement(component, options));
    } catch (e) {
      return cb(e);
    }

    if (engineOptions.beautify) {
      // NOTE: This will screw up some things where whitespace is important, and be
      // subtly different than prod.
      markup = beautifyHTML(markup);
    }

    if (options.settings.env === 'development') {
      // Remove all files from the module cache that are in the view folder.
      Object.keys(require.cache).forEach(function(module) {
        if (moduleDetectRegEx.test(require.cache[module].filename)) {
          delete require.cache[module];
        }
      });
    }

    cb(null, markup);
  }

  return renderFile;
}

exports.createEngine = createEngine;
