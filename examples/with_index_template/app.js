
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

// This should refer to the local React and gets installed via `npm install` in
// the example.
var reactViews = require('express-react-views')

var app = express();

// read in index.html template
var html = fs.readFileSync( path.resolve(__dirname, 'index.html'), 'utf8' );
// split template html string into pre/post parts for faster string concation later
var chunk = html.split('{{content}}');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
// passing in pre/post to view engine
app.engine('jsx', reactViews.createEngine({jsx: {harmony: true}, pre: chunk[0], post: chunk[1] }));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
  something: 'value'
});
app.locals.qaz = 'qut';

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
