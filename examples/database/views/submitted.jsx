var React = require('react');
var DefaultLayout = require('./default');
var Responce = require('./responce');
function App(props) {
  return (
    <DefaultLayout title={props.title} >
        <h1>Customer Reviews</h1>
        <Responce message={props.message} />
    </DefaultLayout>
  );
};

module.exports = App;