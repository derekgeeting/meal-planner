var mongo = require('mongoskin');

var db = require('mongoskin').db(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/mealplanner', {native_parser:true}); 

module.exports = db;

db.bind('user');
db.user.ensureIndex('name', function(err,i){if(err){console.log(err);}});

db.user.findAndModify({username:'derek'}, {}, {$setOnInsert: {username:'derek', name:'Derek'}}, {upsert:true, 'new': true}, function(){});
db.user.findAndModify({username:'ashley'}, {}, {$setOnInsert: {username:'ashley', name:'Ashley'}}, {upsert:true, 'new': true}, function(){});
