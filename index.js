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
  crypto = require('crypto');

reactString.writable = true;

/*
 * jsx: {
 *   extension: string, // any file extension with leading ".", ".jsx" is default.
 *   harmony: boolean // true: enable a subset of ES6 features
 * },
 * doctype: string,Page doctype. // any string that can be used as a doctype, this will be prepended to your document
 * reactJsSrc: string, // path to reactJs library.
 * headContent: string, // any data that can be in <head> tag.
 * headTitle: string, // head <title> tag data.
 * htmlTagAttrs: string, // attributes for <html> tag, must start with empty line " ".
 * bodyTagAttrs: string, // attributes for <body> tag, must start with empty line " ".
 * componentOnly: boolean, // return whole page with <html>,<head>,<body> elements or only react component, by default return whole page.
 * reactParentId: string // id for parent of react component on client render.
 */
var DEFAULT_OPTIONS = {
  jsx: {
    extension: '.jsx',
    harmony: false
  },
  doctype: '<!DOCTYPE html>',
  reactJsSrc: '//fb.me/react-0.12.2.min.js',
  headContent: '',
  headTitle: '',
  htmlTagAttrs: '',
  bodyTagAttrs: ' id="body"',
  componentOnly: false,
  reactParentId: 'body'
};

function createEngine(engineOptions) {
  engineOptions = _merge(DEFAULT_OPTIONS, engineOptions);
  nodeJSX.install(engineOptions.jsx);

  function renderFile(filename, options, cb) {
    // Create hash based on filename + options unique pair.
    var shasum = crypto.createHash('sha1');
    var optionsString = JSON.stringify(options);
    shasum.update(filename + optionsString);
    var cacheKey = shasum.digest('hex');
    if (!renderFile.cache[cacheKey]) {
      try {
        var component = require(filename),
            componentOptions = _merge(engineOptions, options);
        component = React.createFactory(component);
        var markup = {
          pageMarkup: React.renderToString(component(componentOptions)),
          AppName: 'App_' + cacheKey,
          script: ''
        };
        var b = browserify();
        b.require(filename, {expose: markup.AppName})
          .transform(reactify)
          .transform({global: true}, literalify.configure({react: 'window.React'}))
          .transform({global: true}, uglifyify)
          .bundle().pipe(reactString);

        reactString.write = function (buf) {
          markup.script += buf.toString();
        };
        reactString.end = function (buf) {
          if (arguments.length) {
            reactString.write(buf);
          }
          reactString.writable = false;
          // Add to cache.
          renderFile.cache[cacheKey] = generateHtmlSkeleton(markup, componentOptions);
          return cb(null, renderFile.cache[cacheKey]);
        };
        reactString.destroy = function () {
          reactString.writable = false;
        };
      } catch (e) {
        return cb(e);
      }
    } else {
      return cb(null, renderFile.cache[cacheKey]);
    }
  }

  // cache storage
  renderFile.cache = {}
  return renderFile;
}

// Function for preventing not-safe strings output.
function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

// Function for generate base html layout(head, body, html) tags.
function generateHtmlSkeleton(markup, componentOptions) {
  var html = script = '';
  if (markup.script.length) {
    script = '<script>' + markup.script +
    'var ' + markup.AppName + ' = React.createFactory(require("' + markup.AppName + '"));' +
    'React.render(' + markup.AppName + '(' + safeStringify(componentOptions) + '), document.getElementById("' + componentOptions.reactParentId + '"))' +
    '</script>';
  }
  if (componentOptions.componentOnly) {
    html += markup.pageMarkup;
    html += script;
    return html;
  }
  html += componentOptions.doctype;
  html += '<html'+ componentOptions.htmlTagAttrs +'>';
  html += '<head><title>' + componentOptions.headTitle + '</title>' + componentOptions.headContent + '</head>';
  html += '<body' + componentOptions.bodyTagAttrs + '>';
  html += markup.pageMarkup;
  if (componentOptions.reactJsSrc.length) {
    html += '<script src="' + componentOptions.reactJsSrc + '"></script>';
  }
  html += script;
  html += '</body></html>';
  return html;
}

exports.createEngine = createEngine;
