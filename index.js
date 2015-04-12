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
var nodeJSX = require('node-jsx');
var assign = require('object-assign');

var DEFAULT_OPTIONS = {
  jsx: {
    extension: '.jsx',
    harmony: false,
    stripTypes: false
  },
  doctype: '<!DOCTYPE html>',
  beautify: false,
  static: true
};

function createEngine(engineOptions) {
  engineOptions = engineOptions || {};
  // Merge was nice because it did nest objects. assign doesn't. So we're going
  // to assign the JSX options then the rest. If there were more than a single
  // nested option, this would be really dumb. As is, it looks pretty stupid but
  // it keeps our dependencies slim.
  var jsxOptions = assign({}, DEFAULT_OPTIONS.jsx, engineOptions.jsx);
  // Since we're passing an object with jsx as the key, it'll override the rest.
  engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions, {jsx: jsxOptions});

  // Don't install the require until the engine is created. This lets us leave
  // the option of using harmony features up to the consumer.
  nodeJSX.install(engineOptions.jsx);

  var moduleDetectRegEx = new RegExp('\\' + engineOptions.jsx.extension + '$');

  function renderFile(filename, options, cb) {
    try {
      var markup = engineOptions.doctype;
      var component = require(filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
      if (engineOptions.static) {
        markup +=
          React.renderToStaticMarkup(React.createElement(component, options));
      } else {
        markup +=
          React.renderToString(React.createElement(component, options));
      }
    } catch (e) {
      return cb(e);
    }

    if (engineOptions.beautify) {
      // NOTE: This will screw up some things where whitespace is important, and be
      // subtly different than prod.
      markup = beautifyHTML(markup);
    }

    if (options.settings.env === 'development') {
      // Remove all files from the module cache that use our extension. If we're
      // using .js, this could be sloooow. On the plus side, we can now make changes
      // to our views without needing to restart the server.
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
