"use strict";

/**
* Mongoose Schema for a property (house, apartment, etc.)
* @module LuxeAdmin/datastore/propertySchema
*/

var mongoose = require('mongoose'),
    
    propertyLocalSchema = require('./propertyLocalSchema'),
    
    propertySchema = new mongoose.Schema({
        propertyType: String,
        price: Number,
        address: String,
        city: String,
        state: String,
        postalCode: Number,
        bedrooms: Number,
        bathrooms: Number,
        style: String,
        floorArea: String,
        landSize: String,
        listNumber: Number,
        yearBuilt: Number,
        area: Number,
        amenities: {
            garage: Boolean,
            cooling: String,
            heating: String,
            interior: String,
            exterior: String,
            equipment: String,
            floors: String,
            windows: String
        },
        locale: [propertyLocalSchema],
        
        realtor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'  
        },
        propertySite: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PropertySite'
        },
        createdAt: Date,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedAt: Date,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    });

propertySchema.pre('save', function(next){
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    next();
});
propertySchema.pre('update', function() {
    this.update({
        updatedAt: Date.now()
    });
});

module.exports = propertySchema;