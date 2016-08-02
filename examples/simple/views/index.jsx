var React = require('react');
var Layout = require('./layout');

// Contrived example to show how one might use Flow type annotations
function countTo(n:number):string {
  var a = [];
  for (var i = 0; i < n; i++ ) {
    a.push(i + 1);
  }
  return a.join(', ');
}

class Index extends React.Component {
  render() {
    return (
      <Layout title={this.props.title}>
        <h1>{this.props.title}</h1>
        <p>Welcome to {this.props.title}</p>
        <p>
          I can count to 10:
          {countTo(10)}
        </p>
      </Layout>
    );
  }
}

Index.propTypes = {
  title: React.PropTypes.string
};

module.exports = Index;
