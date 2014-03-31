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

// TODO: This will result in views being cached, which kinda sucks.
require('node-jsx').install({extension: '.jsx'});

function renderFile(filename, options, cb) {
  try {
    // TODO: Make it possible to specify different doctypes
    var markup = '<!doctype html>'
    var component = require(filename);
    markup += React.renderComponentToStaticMarkup(component(options));
  } catch (e) {
    return cb(e);
  }

  // NOTE: This will screw up some things where whitespace is important, and be
  // subtly different than prod. Maybe make this an optional thing.
  if (options.settings.env === 'development') {
    markup = beautifyHTML(markup);
  }

  cb(null, markup);
}

// Not really needed to be set up this way...
module.exports.renderFile = renderFile;
module.exports.__express = renderFile;
