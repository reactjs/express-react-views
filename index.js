/*
 *  Copyright (c) 2014, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var beautifyHTML = require('js-beautify').html;
var assign = require('object-assign');

var DEFAULT_OPTIONS = {
  doctype: '<!DOCTYPE html>',
  beautify: false,
  transformViews: true,
  babel: {
    presets: [
      'react',
      'es2015',
    ],
  },
};

function createEngine(engineOptions) {
  var registered = false;
  var moduleDetectRegEx;

  engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions || {});

  function renderFile(filename, options, cb) {
    // Defer babel registration until the first request so we can grab the view path.
    if (!moduleDetectRegEx) {
      //on Windows, folder names may have backslashes, which are interpretted as escape sequences in regex
      //linux folder names can also contain backslashes, so we need to escape those
      var viewsFolder = options.settings.views;
      var singleBackslashRegExp = new RegExp('\\\\','g'); //matches every instance of a single backslash
      //now escape the backslashes. Double every one so that the regex doesn't interpret them as escapes
      viewsFolder = viewsFolder.replace(singleBackslashRegExp, '\\\\');

      //now create the module detection regex which includes the escaped path
      moduleDetectRegEx = new RegExp('^' + viewsFolder);
    }
    if (engineOptions.transformViews && !registered) {
      // Passing a RegExp to Babel results in an issue on Windows so we'll just
      // pass the view path.
      require('babel-register')(
        assign({only: options.settings.views}, engineOptions.babel)
      );
      registered = true;
    }

    try {
      var markup = engineOptions.doctype;
      var component = require(filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
      markup += ReactDOMServer.renderToStaticMarkup(
        React.createElement(component, options)
      );
    } catch (e) {
      return cb(e);
    } finally {
      if (options.settings.env === 'development') {
        // Remove all files from the module cache that are in the view folder.
        Object.keys(require.cache).forEach(function(module) {
          if (moduleDetectRegEx.test(require.cache[module].filename)) {
            delete require.cache[module];
          }
        });
      }
    }

    if (engineOptions.beautify) {
      // NOTE: This will screw up some things where whitespace is important, and be
      // subtly different than prod.
      markup = beautifyHTML(markup);
    }

    cb(null, markup);
  }

  return renderFile;
}

exports.createEngine = createEngine;
