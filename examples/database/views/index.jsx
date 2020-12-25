var React = require('react');
// import './public/css/index.css'
var DefaultLayout = require('./default');
var Form = require('./form');
function App(props) {
  return (
    <DefaultLayout title={props.title} >
        <h1 className="firstheading">Customer Reviews</h1>
        <Form />
    </DefaultLayout>
  );
};

module.exports = App;