var React = require('react');
var PropTypes = require('prop-types');
var createClass = require('create-react-class');

function countTo(n) {
  var a = [];
  for (var i = 0; i < n; i++) {
    a.push(i + 1);
  }
  return a.join(', ');
}

var Index = createClass({
  propTypes: {
    title: PropTypes.string,
  },

  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>Welcome to {this.props.title}</p>
        <p>
          I can count to 10:
          {countTo(10)}
        </p>
      </div>
    );
  },
});

module.exports = Index;
