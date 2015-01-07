
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer = require('multer');
var errorHandler = require('errorhandler');
var session = require('express-session');
// This should refer to the local React and gets installed via `npm install` in
// the example.
var reactViews = require('express-react-view-engine')

var app = express();

// all environments
app.set('port', process.env.PORT || 3700);
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine({jsx: {harmony: true}}));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
  saveUninitialized: true,
  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
