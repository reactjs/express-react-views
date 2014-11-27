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
var _merge = require('lodash.merge');
var fs = require('fs');
var reactTools = require('react-tools');


var DEFAULT_OPTIONS = {
  jsx: {
    extension: '.jsx',
    harmony: false
  },
  mountInClient : false,
  reactLink: 'http://fb.me/react-with-addons-0.12.1.js',
  doctype: '<!DOCTYPE html>',
  beautify: false
};


function insertIntoString (originalStr, index, insertStr) {
  if (index > 0)
    return originalStr.substring(0, index) + insertStr + originalStr.substring(index, originalStr.length);
  else
    return insertStr + originalStr;
};

function createEngine(engineOptions) {
  engineOptions = _merge(DEFAULT_OPTIONS, engineOptions);

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
      component = React.createFactory(component);
      
      if(engineOptions.mountInClient) {
        //Render the component to the string, so that it'll be able to be mounted later
        markup += React.renderToString(component(options));

        //We'll need to use the react library to mount the component in-browser
        var reactScriptTag = '<script src="' + engineOptions.reactLink + '"></script>';

        //We need to find the position of the end of the body tag.
        //That position is where we'll inject the js for mounting  of the react component.
        var endOfBodyPos = markup.indexOf('</body>');

        //We read in the raw jsx for the react component
        var jsxContent = fs.readFileSync(filename).toString();

        //In the JSX view, there will be a require('React') statement.
        //We don't want this in the browser; we don't need to require react
        //React will be loaded in the script tag, as the variable react.
        //So we need to replace the require with a reference to the React variable
        jsxContent = jsxContent.replace(/require\s*\(\s*['"]react['"]\s*\)/i, 'React');

        //Let's transform the JSX to JS, since we don't want that to happen in-browser
        var mountingJS = reactTools.transform(jsxContent);

        //There will be a reference to module.exports in the view.
        //This will error in-browser since 'module' isn't defined.
        //So we define it.
        mountingJS = '\nvar module = {};\n' + mountingJS;

        //The options need to be stringified to be passed as props into the component.
        //CAVEAT: the Settings object from Express is also passed in (and sent to client)
        var stringifiedOptions = JSON.stringify(options);

        //We have to insert code to actually mount the React component over the whole document.
        mountingJS = mountingJS + 'React.render(React.createElement(module.exports, ' + stringifiedOptions + '), document);';

        //Lets bring together the scripts that will mount the component
        var insertScript = reactScriptTag + '\n <script>\n' + mountingJS + '\n</script>';

        //We finally insert the component-mounting JS at the of the HTML body
        markup = insertIntoString(markup, endOfBodyPos, insertScript);
      } else{
        markup += React.renderToStaticMarkup(component(options));
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
