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
// Additional user stories
//
// 4. User Story: When I pass the 'urls' keyword in the url, all the URLs in
//    the database will be displayed in JSON format.
// 5. When I pass the 'delete' keyword in the url along with either a
//    parameter containing the URL or its shortcode, that URL will be deleted
//    from the database.
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
//   2. Implement routes to incorporate the following functionality
//      - /new/<url> ... Add a new URL to the database (original reqmnt.)
//      - /<shortcode> .. Redirect to the original long URL (original reqmnt.)
//      - /urls ... Display all URLs and their short codes (new reqmnt.)
//      - /delete/<url> ... Remove the URL entry from the DB (new reqmnt.)
//      - /delete/<shortcode> ... Remove the URL entry from the DB (new reqmnt.)
//   3. Use Promises to eliminate "Callback Hell"
//   4. Generate all errors as JSON of the format {error: <message>}
//   5. Heavily comment code to use this application as a reference for future
//      projects.

"use strict";
const config = require("../config");
const express = require("express");
const mongodb = require("mongodb");
const path = require("path");
const shortid = require("shortid");
const validUrl = require("valid-url");

const router = express.Router();
const UrlSchema = require("../model/urlschema.js");

// Establish a mongo connection using settings from the config.js file
//const mongoUri = "mongodb://" + config.db.host + "/" + config.db.name;
const mongoUri = "mongodb://heroku_63zdbcvf:qnkn8qhnpgojvqh9a17gbhh1n4@ds017246.mlab.com:17246/heroku_63zdbcvf";
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Home page
//         (http://localhost:3000)
router.get("/", function(request, response, next) {
  response.sendFile(path.join(__dirname + "/../views/index.html"));
});

// Route - Delete a URL from the database given either a full URL or its
//         corresponding shortcode
//         (http://localhost:3000/delete/<url or shortcode>)
router.get("/delete/:dbEntryId(*)", function(request, response, next) {
  mongoClient.connect(mongoUri)
    .then((db) => {
      console.log("Successfully connected to MongoDB");
      const entryParam = request.params.dbEntryId;
      const collection = db.collection("links");
      let searchFilter = {};

      // Determine if the entryParam is a full URL or a shortcode.
      if (validUrl.isUri(entryParam)) {
        searchFilter["url"] = entryParam;
      } else {
        searchFilter["short_code"] = entryParam;
      }
      console.log("searchFilter: ", searchFilter);
      const urlDocument = collection.findOneAndDelete(searchFilter)
        .then((document) => {
          if (document) {
            response.json({
              error: "Entry has been removed from the database. " + entryParam
            });
          } else {
            response.json({
              error: "Entry was not found in the database. " + entryParam
            });
          }
        })
        .catch((error) => {
          response.json({
            error: "Error encountered attempting to delete URL from the database. Error:" +
              error
          });
        });
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB",
        error);
    });
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
          })
          .then((document) => {
            if (document) {
              response.json({
                error: "Duplicate URL in database." + urlParam
              });
            } else {
              const shortCode = shortid.generate();
              const newUrl = {
                url: urlParam,
                short_code: shortCode
              };
              collection.insert([newUrl])
                .then(() => {
                  response.json({
                    url: urlParam,
                    short_code: shortCode,
                    short_url: localUrl + shortCode
                  });
                })
                .catch((error) => {
                  response.json({
                    error: "Error inserting URL in database. Error: " +
                      error
                  });
                });
            }
          })
          .catch((error) => {
            response.json({
              error: "Error encountered attempting to find URL in database. Error:" +
                error
            });
          });
      } else {
        response.json({
          error: "Incorrect URL format. Ensure that your URL has a valid protocol and format. " +
            urlParam
        });
      }
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB",
        error);
    });
});

// Route - Display all url entries in the database
//         (http://localhost:3000/urls)
router.get("/urls/", function(request, response, next) {
  mongoClient.connect(mongoUri)
    .then((db) => {
      console.log("Successfully connected to MongoDB");
      const collection = db.collection('links');
      collection.find().toArray()
        .then((urls) => {
          if (urls != null) {
            response.json({
              urls: urls
            });
          } else {
            response.json({
              error: "There are no URLs in the database"
            });
          }
        })
        .catch((error) => {
          response.json({
            error: "Error retrieving all urls from database. Error: ",
            error
          });
        });
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB",
        error);
    });
});

// Route - Use a shortened URL to access the website
//         (http://localhost:3000/<shortcode>)
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
        })
        .then((document) => {
          if (document != null) {
            response.redirect(document.url);
          } else {
            response.json({
              error: "No corresponding shortlink found in the database."
            });
          };
        })
        .catch((error) => {
          response.json({
            error: "Error encountered attempting to find the URL. Error: " +
              error
          });
        });
    })
    .catch((error) => {
      response.json({
        error: "Unable to establish connection to MongoDB. Error: " +
          error
      });
    });
});


module.exports = router;
