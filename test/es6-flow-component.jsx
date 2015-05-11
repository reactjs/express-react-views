const React = require('react');

// Contrived example to show how one might use Flow type annotations
function countTo(n:number):string {
  var a = [];
  for (var i = 0; i < n; i++ ) {
    a.push(i + 1);
  }
  return a.join(', ');
}

class Index = extends React.Component {
  render() {
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
  }
}

Index.propTypes = {
  title: Read.PropTypes.string
};

module.exports = Index;
