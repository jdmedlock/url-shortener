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
//
// Special considerations:
//
//   Prior to starting this exercise I had finished learnyounode and
//   learnyoumongo, but they did not adequately prepare me for this API
//   project. To make up for this I used a combination of books, websites,
//   YouTube videos, and a Udemy course to prepare. Of most value was the
//   tutorial from Michael Lefkowitz (http://lefkowitz.me/thoughts/?p=53).
//
//   To ensure that I was learning rather than just copying the information
//   from the Lefkowitz tutorial I've made the following changes and additions
//
//   1. Generate the hash of the long URL using a Base-64 algorithm
//   2. Use Mongoose on top of MongoDB
//   3. Implement routes to incorporate the following functionality
//      - /new/<url> ... Add a new URL to the database (original reqmnt.)
//      - /<shortcode> .. Redirect to the original long URL (original reqmnt.)
//      - /urls ... Display all URLs and their short codes (new reqmnt.)
//      - /delete/<url> ... Remove the URL entry from the DB (new reqmnt.)
//      - /delete/<shortcode> ... Remove the URL entry from the DB (new reqmnt.)
//   4. Generate all errors as JSON of the format {error: <message>}
//   5. Heavily comment code to use this application as a reference for future
//      projects.

"use strict";
const config = require("../config");
const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");
const shortid = require("shortid");
const validUrl = require("valid-url");

const router = express.Router();
const UrlSchema = require("../model/urlschema.js");

// Establish a mongo connection using settings from the config.js file
const mongoUri = "mongodb://" + config.db.host + "/" + config.db.name;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Home page (http://localhost:3000)
router.get("/", function(request, response, next) {
  response.sendFile(path.join(__dirname + "/../views/index.html"));
});

// Route - Shorten a new URL (http://localhost:3000/new/<url>)
router.get("/new/:longurl(*)", function(request, response, next) {
  mongoClient.connect(mongoUri)
    .then((db) => {
      console.log("Successfully connected to MongoDB");
      const urlParam = request.params.longurl;
      const collection = db.collection("links");
      const localUrl = request.get("host") + "/";

      // Check to ensure that the URL doesn't already exist before adding
      // it to the database
      if (validUrl.isUri(urlParam)) {
        const urlDocument = collection.findOne({
          url: urlParam
        }, function(err, document) {
          console.log("urlDocument: ", urlDocument);
          if (document) {
            response.json({
              error: "Duplicate URL. " + urlParam
            });
          } else {
            const shortCode = shortid.generate();
            const newUrl = {
              url: urlParam,
              short_code: shortCode
            };
            collection.insert([newUrl]);
            response.json({
              url: urlParam,
              short_code: shortCode,
              short_url: localUrl + shortCode
            });
          }
        });
      } else {
        response.json({
          error: "Incorrect URL format. Ensure that your URL has a valid protocol and format. " +
            urlParam
        });
      };
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB", err);
    });
});

// Route - Display all url entries in the database (http://localhost:3000/urls)
router.get("/urls/", function(request, response, next) {
    mongoClient.connect(mongoUri)
      .then((db) => {
        console.log("Successfully connected to MongoDB");
        const collection = db.collection('links');
        collection.find().toArray((err, urls) => {
          if (urls != null) {
            console.log("urls: ", urls);
          } else {
            response.json({
              error: "No corresponding shortlink found in the database."
            });
          };
        });
      })
      .catch((error) => {
        console.log("Unable to establish connection to MongoDB", err);
      });
});

// Route - Use a shortened URL to access the website (http://localhost:3000/<shortcode>)
router.get("/:shortcode", function(request, response, next) {
  mongoClient.connect(mongoUri)
    .then((db) => {
      console.log("Successfully connected to MongoDB");
      const collection = db.collection('links');
      const shortCode = request.params.shortcode;

      // Use the value of the short code parameter to retrieve the and display
      // the long URL from the database.
      collection.findOne({
        "short_code": shortCode
      }, {
        url: 1,
        _id: 0
      }, function(err, doc) {
        if (doc != null) {
          response.redirect(doc.url);
        } else {
          response.json({
            error: "No corresponding shortlink found in the database."
          });
        };
      });
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB", err);
    });
});

module.exports = router;
