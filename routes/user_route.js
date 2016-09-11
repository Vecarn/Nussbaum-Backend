var express = require('express');
var router = express.Router();
var config = require("../config.js");
var reputation_module = require('../reputation_module.js');
var middleware_module = require('../middleware_module.js');
//Model
var User = require('../models/user_model.js');

//Users (/user) - GET
router.get("/:name?", function(req, res) {
  if (req.params.name) {
    User.findOne({ 'name':  req.params.name}, '-password -avatar', function (err, user) {
      if (err) {
        res.sendStatus(500);
      }
      if (user) {
        res.json(user);
      }
      else {
        res.sendStatus(404);
      }
    })
  }
  else {
    User.find({}, '-password -avatar', function (err, users) {
      if (err) {
        res.sendStatus(500);
      }
      else {
        res.json(users);
      }
    });
  }
});
//Users (/user) - POST
router.post('/', middleware_module.checkloggedin, function(req, res) {
  reputation_module.userrep(req.user.name, function(rep) {
    if(rep>=3) {
      var user1 = new User({name: req.body.name, email: req.body.email, prename: req.body.prename, surname: req.body.surname, password: req.body.password, status: req.body.status});
      user1.save(function (err, userObj) {
        if (err) {
          res.sendStatus(500);
        }
        else {
          res.json(userObj);
        }
      });
    }
    else {
      res.sendStatus(401);
    }
  })
});
module.exports = router