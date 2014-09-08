/**
 * @jsx React.DOM
 */

var React = require('react');

var Layout = require('./layout');
var PageHeader = require('./PageHeader');
var PageFooter = require('./PageFooter');


var Index = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },

  render: function() {
    return (
      <div>
        <PageHeader />
        <h1>{this.props.title}</h1>
        <p>Welcome to {this.props.title}</p>
        <PageFooter />
      </div>
    );
  }
});

module.exports = Index;
