var mongo = require('mongoskin');

var db = require('mongoskin').db(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/mealplanner', {native_parser:true}); 

module.exports = db;

db.bind('user');
db.user.ensureIndex('name', function(err,i){if(err){console.log(err);}});

db.user.findAndModify({username:'derek'}, {}, {$setOnInsert: {username:'derek', name:'Derek'}}, {upsert:true, 'new': true}, function(){});
db.user.findAndModify({username:'ashley'}, {}, {$setOnInsert: {username:'ashley', name:'Ashley'}}, {upsert:true, 'new': true}, function(){});

db.bind('meal');
db.meal.ensureIndex('owner', function(err,i){if(err){console.log(err);}});
db.meal.ensureIndex('name', function(err,i){if(err){console.log(err);}});
db.meal.ensureIndex('servings', function(err,i){if(err){console.log(err);}});
db.meal.ensureIndex('type', function(err,i){if(err){console.log(err);}});
db.meal.ensureIndex('preptime', function(err,i){if(err){console.log(err);}});
db.meal.ensureIndex('ingredients.name', function(err,i){if(err){console.log(err);}});
