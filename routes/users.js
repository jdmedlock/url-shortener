// File name: users.js
// Date: 01/29/2017
// Programmer: Jim Medlock
//
// freeCodeCamp Backend Certificate API Project - URL Shortener Microservice
//
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(request, response, next) {
  response.send('respond with a resource');
});

module.exports = router;
