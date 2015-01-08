var React = require('react');
var Content = require('./Content');

module.exports = React.createClass({

  render: function() {
    var data = this.props.data;

    // render the content as a dynamic react component
    var contentHtml = React.renderToString(<Content {...data}/>);

    // re-render the content as json,
    // for client-side app initialization
    var initScript = 'main(' + JSON.stringify(data).replace(/script/g, 'scr"+"ipt') + ')';

    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"/>
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{__html: contentHtml}}/>

          <script src="/main.js"></script>
          <script dangerouslySetInnerHTML={{__html: initScript}} />

        </body>
      </html>
    );
  }

});
