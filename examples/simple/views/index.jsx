var React = require('react');
var PropTypes = require('prop-types');
var Layout = require('./layout');

// Contrived example to show how one might use Flow type annotations
function countTo(n: number): string {
  var a = [];
  for (var i = 0; i < n; i++) {
    a.push(i + 1);
  }
  return a.join(', ');
}

function Index(props) {
  return (
    <Layout title={props.title}>
      <h1>{props.title}</h1>
      <p>Welcome to {props.title}</p>
      <p>
        I can count to 10:
        {countTo(10)}
      </p>
    </Layout>
  );
}

Index.propTypes = {
  title: PropTypes.string,
};

module.exports = Index;
