var React = require('react');
 
function DefaultLayout(props) {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <link rel="stylesheet" href="../static/index.css" />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
 
module.exports = DefaultLayout;