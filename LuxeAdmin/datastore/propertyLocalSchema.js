"use strict";

/**
* Mongoose Schema for a local business/area of interest, near a property
* @module LuxeAdmin/datastore/propertyLocalSchema
*/

var mongoose = require('mongoose'),

    propertyLocalSchema = mongoose.Schema({
        name: String,
        address: String,
        phone: Number,
        category: String
    });

module.exports = propertyLocalSchema;