var express = require('express')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var mongo = require('mongoskin');
var async = require('async');

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

var getUser = function(userId, cb) {
  var user;

  var loadUser = function(cb1) {
    app.db.user.findById(userId, function(err,theUser) {
      user = theUser;
      cb1(err,user);
    });
  }

  var loadPlan = function(cb1) {
    if(user && user.plan) {
      var planIds = _(user.plan).values().map(function(ar){return _.map(ar,function(id){return mongo.helper.toObjectID(id)})}).flatten().value();
      app.db.meal.find({'_id':{'$in':planIds}}).toArray(function(err, meals) {
        if(err) {
          return cb1(err);
        }
        var mealsById = _.map(meals, function(m) {
          var o = {};
          o[m._id+''] = m;
          return o;
        });
        _.each(_.keys(user.plan), function(day) {
          user.plan[day] = _.map(user.plan[day], function(mealId) {
            return _.findWhere(meals,{'_id':mealId});
          });
        });
        cb1(null,user);
      });
    } else {
      cb1(null,user);
    }
  }

  async.series([
    loadUser,
    loadPlan
  ], function(err, result) {
    cb(err,user);
  });
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
  getUser(mongo.helper.toObjectID(req.user._id), function(err, user) {
    res.json({
      user: user
    });
  });
});

app.get('/api/meals', function(req,res) {
  app.db.meal.find({owner:mongo.helper.toObjectID(req.user._id)}).toArray(function(err,meals) {
    res.json({
      meals: meals
    });
  });
});

app.delete('/api/meals/:id', function(req,res) {
  app.db.meal.removeById(req.params.id, function(err,result) {
    if(err) {
      res.status(500).send({
        error: err
      });
    } else {
      res.json({
        success:true
      });
    }
  });
});

app.delete('/api/plan/:day/:index', function(req,res) {
  app.db.user.findById(mongo.helper.toObjectID(req.user._id), function(err,user) {
    user.plan[req.params.day].splice(req.params.index,1);
    app.db.user.save(user, function(err, savedUser) {
      getUser(mongo.helper.toObjectID(req.user._id), function(err,theUser) {
        res.json({
          user: theUser
        });
      });
    });
  });
});

app.post('/api/meals', function(req,res) {
  var meal = req.body;
  meal.owner = mongo.helper.toObjectID(req.user._id);
  if(meal._id) {
    meal._id = mongo.helper.toObjectID(meal._id);
  }
  app.db.meal.save(meal, function(err, savedMeal) {
    if(err || !savedMeal || savedMeal.length===0) {
      res.status(500).send({error:'crap happens'});
    } else {
      res.json({
        meal: meal
      });
    }
  });
});

app.post('/api/plan', function(req,res) {
  var mealId = mongo.helper.toObjectID(req.body.meal);
  var day = req.body.day;
  app.db.user.findById(mongo.helper.toObjectID(req.user._id), function(err,user) {
    if(!user.plan) {
      user.plan = {};
    }
    if(!user.plan[day]) {
      user.plan[day] = [];
    }
    user.plan[day].push(mealId);
    app.db.user.save(user, function(err, savedUser) {
      getUser(mongo.helper.toObjectID(req.user._id), function(err,theUser) {
        res.json({
          user: theUser
        });
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log("app is running on port:" + app.get('port'))
})