var React = require('react');
var Content = React.createFactory(require('./Content'));

window.main = function (data, containerId) {
  var container = document.getElementById(containerId || 'content');
  React.render(
    <Content {...data} />,
    container
  );
};
