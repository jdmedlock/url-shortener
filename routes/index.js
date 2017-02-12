// File name: server.js
// Date: 01/29/2017
// Programmer: Jim Medlock
//
// freeCodeCamp Backend Certificate API Project - URL Shortener Microservice
//
// Build a full stack JavaScript app that is functionally similar to this:
// https://little-url.herokuapp.com/ and deploy it to Heroku.
//
// 1. User Story: I can pass a URL as a parameter and I will receive a
//    shortened URL in the JSON response.
// 2. User Story: If I pass an invalid URL that doesn't follow the valid
//    http://www.example.com format, the JSON response will contain an error
//    instead.
// 3. User Story: When I visit that shortened URL, it will redirect me to my
//    original link. 
//
// Example creation usage:
//
//   https://little-url.herokuapp.com/new/https://www.google.com
//   https://little-url.herokuapp.com/new/http://foo.com:80
//
// Example creation output:
//
//   { "original_url":"http://foo.com:80",
//     "short_url":"https://little-url.herokuapp.com/8170" }
//
// Usage:
//
//   The URL https://little-url.herokuapp.com/2871 will redirect to
//   https://www.google.com/

"use strict";
const config = require('../config');
const express = require('express');
const mongodb = require('mongodb');
const shortid = require('shortid');
const validUrl = require('valid-url');

const router = express.Router();

var mongoUri = 'mongodb://' + config.db.host + '/' + config.db.name;
var mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Home page (http://localhost:3000)
router.get('/', function(request, response, next) {
  response.render('index', {
    title: 'Express'
  });
});

// Route - Shorten a new URL (http://localhost:3000/new/<url>)
router.get('/new/:longurl*', function(request, response, next) {
  mongoClient.connect(mongoUri, function(err, db) {
    if (err) {
      console.log("Unable to establish connection to MongoDB", err);
    } else {
      console.log("Successfully connected to MongoDB");
      const urlParam = request.params.longurl;
      const collection = db.collection("links");
      const localUrl = request.get("host") + "/";
      let newLink = function(db, callback) {
        if (validUrl.isUri(urlParam)) {
          var shortCode = shortid.generate();
          var newUrl = {
            url: urlParam,
            short: shortCode
          };
          collection.insert([newUrl]);
          response.json({
            original_url: urlParam,
            short_url: localUrl + shortCode
          });
        } else {
          response.json({
            error: "Incorrect URL format. Ensure that your URL has a valid protocol and format. " +
              urlParam
          });
        };
      };
      newLink(db, function() {
        db.close();
      });
    };
  });
});

// Route - Use a shortened URL to access the website (http://localhost:3000/<shortcode>)
router.get('/:shortcode', function (request, response, next) {
  mongoClient.connect(mongoUri, function (err, db) {
    if (err) {
      console.log("Unable to establish connection to MongoDB", err);
    } else {
      console.log("Successfully connected to MongoDB");
      var collection = db.collection('links');
      var shortCode = request.params.shortcode;
      var findLink = function (db, callback) {
        collection.findOne({"short": shortCode}, { url: 1, _id: 0 }, function (err, doc) {
          if (doc != null) {
            response.redirect(doc.url);
          } else {
            response.json({ error: "No corresponding shortlink found in the database." });
          };
        });
      };

      findLink(db, function () {
        db.close();
      });
    };
  });
});

module.exports = router;
