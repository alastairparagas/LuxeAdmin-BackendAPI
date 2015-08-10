/**
* Mongoose Model for propertySchema
* @module LuxeAdmin/datastore/propertyModel
*/
"use strict";

var mongoose = require('mongoose'),
    
    propertySchema = require('./propertySchema'),
    
    propertyModel = mongoose.model('Property', propertySchema);

module.exports = propertyModel;