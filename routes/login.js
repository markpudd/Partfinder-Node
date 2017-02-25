var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var user = require('../models/User.js');
var passport = require('passport');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');


/* POST /configs/:id */
router.post('/',   function(req, res, next) {
  username=req.body.username;
  password=req.body.password;
  user.findOne( {'username' : username},  function (err, loginuser) {

    if (err) return next(err);
    if(loginuser != null && loginuser.username == username && bcrypt.compareSync(password, loginuser.password)) {
        var token = jwt.encode(loginuser, process.env.JWT_SECRET);
        res.json({'token' : token});
    } else {
        res.json({'error' : 'Wrong creds'});
    }
  });
});


module.exports = router;
