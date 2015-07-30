"use strict";

/**
* Mongoose Model for a User Schema
* @module LuxeAdmin/datastore/userModel
*/

var mongoose = require('mongoose'), 
    
    userSchema = require('./userSchema'), 
    
    userModel = mongoose.model('User', userSchema);

module.exports = userModel;