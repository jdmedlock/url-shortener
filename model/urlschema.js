// File name: UrlSchema.js
// Date: 02/04/2017
// Programmer: Jim Medlock
//
// freeCodeCamp Backend Certificate API Project - URL Shortener Microservice
//
// Define the Mongoose database model for use across the application
//
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = mongoose.Schema({
   url: {type: String, required: true },
   short_code: {type: Number, default: 0, required: true},
   short_url: {type: String }
}, { collection: 'urls' });

module.exports = mongoose.model('Url', urlSchema);
