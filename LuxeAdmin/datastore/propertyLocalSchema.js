/**
* Mongoose Schema for a local business/area of interest, near a property
* @module LuxeAdmin/datastore/propertyLocalSchema
*/
"use strict";

var mongoose = require('mongoose'),

    propertyLocalSchema = mongoose.Schema({
        name: String,
        address: String,
        city: String,
        state: String,
        postalCode: Number,
        phone: Number,
        category: [String]
    });

module.exports = propertyLocalSchema;