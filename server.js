var express = require('express')
var app = express();
var _ = require('lodash');

var db = require('mongoskin').db(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/mealplanner', {native_parser:true}); 
db.bind('user');
db.user.ensureIndex('name', function(err,i){if(err){console.log(err);}});

db.user.findAndModify({name:'derek'}, {}, {$setOnInsert: {name:'derek'}}, {upsert:true, 'new': true}, function(){});
db.user.findAndModify({name:'ashley'}, {}, {$setOnInsert: {name:'ashley'}}, {upsert:true, 'new': true}, function(){});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  db.user.find({}).toArray(function(err, users){
    res.send('Users: '+_.pluck(users,'name').join(','));
  });
})

app.listen(app.get('port'), function() {
  console.log("app is running on port:" + app.get('port'))
})