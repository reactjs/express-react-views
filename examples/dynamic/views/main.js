var React = require('react');
var ReactDOM = require('react-dom');
var Content = require('./Content');

module.exports = function (data, containerId) {
  var container = document.getElementById(containerId || 'content');
  ReactDOM.render(
    <Content {...data} />,
    container
  );
};
