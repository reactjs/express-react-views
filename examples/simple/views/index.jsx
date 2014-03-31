/**
 * @jsx React.DOM
 */

var React = require('react');

var Layout = require('./layout');

var Index = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },

  render: function() {
    return (
      <Layout title={this.props.title}>
        <h1>{this.props.title}</h1>
        <p>Welcome to {this.props.title}</p>
      </Layout>
    );
  }
});

module.exports = Index;
