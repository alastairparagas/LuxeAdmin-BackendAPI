/**
* Mongoose Model for propertySiteSchema
* @module LuxeAdmin/datastore/propertySiteModel
*/
"use strict";

var mongoose = require('mongoose'),
    
    propertySiteSchema = require('./propertySiteSchema'),
    
    propertySiteModel = mongoose.model('PropertySite', propertySiteSchema);

module.exports = propertySiteModel;