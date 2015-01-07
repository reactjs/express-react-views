/**
 * @jsx React.DOM
 */

var React = require('react');

var Index = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },
  click: function () {
    alert('It works :-p')
  },
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p onClick={this.click}>Welcome to {this.props.title} - <u>click me to check that React works on client.</u></p>
      </div>
    );
  }
});

module.exports = Index;
