var express = require('express');
var reactViews = require('express-react-views');

var app = express();

app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  var initialState = {
    items: [
      'document your code',
      'drop the kids off at the pool',
      '</script><script>alert(666)</script>'
    ],
    text: ''
  };
  res.render('Html', { data: initialState });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Dynamic react example listening on port ' + port);
});
