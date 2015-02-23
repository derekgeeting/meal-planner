var express = require('express')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var app = express();
app.db = require('./db/db.js');

app.set('port', (process.env.PORT || 5000))
app.set('secret', 'heydonttellanyonebutthisisabigsecret');

app.use('/api', expressJwt({secret:app.get('secret')}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());
app.use(express.static(__dirname + '/public'))

var createToken = function(user) {
  return jwt.sign( user, app.get('secret'), {expiresInMinutes:60*24*7} );
}

app.post('/login', function(req,res) {
  app.db.user.findOne({
    username: req.body.username
  }, function(err, user) {
    if(err) {
      res.status(500).send({message:'whoopsie'});
    } else if(!user) {
      res.status(401).send({message:'Incorrect username or password'});
    } else {
      res.json({
        token: createToken(user),
        user: user
      });
    }
  });
});

app.get('/api/user', function(req,res) {
  res.json({
    user: req.user
  });
});

app.get('/api/test', function(req,res) {
  // console.log(req);
  res.json({
    user: req.user
  });
});

app.listen(app.get('port'), function() {
  console.log("app is running on port:" + app.get('port'))
})