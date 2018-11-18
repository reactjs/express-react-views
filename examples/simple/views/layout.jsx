var React = require('react');
var PropTypes = require('prop-types');

function Layout(props) {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <link rel="stylesheet" href="/stylesheets/style.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          // This is making use of ES6 template strings, which allow for
          // multiline strings. We specified "{jsx: {harmony: true}}" when
          // creating the engine in app.js to get this feature.
          console.log("hello world");
        `,
          }}
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}

Layout.propTypes = {
  title: PropTypes.string,
};

module.exports = Layout;
