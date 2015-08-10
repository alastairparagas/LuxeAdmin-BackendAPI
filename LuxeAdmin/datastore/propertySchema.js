/**
* Mongoose Schema for a property (house, apartment, etc.)
* @module LuxeAdmin/datastore/propertySchema
*/
"use strict";

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
        livingArea: String,
        lotSize: String,
        mlsNumber: Number,
        yearBuilt: Number,
        amenitiesGarage: Boolean,
        amenitiesCooling: String,
        amenitiesHeating: String,
        amenitiesInterior: String,
        amenitiesExterior: String,
        amenitiesEquipment: String,
        amenitiesFloors: String,
        amenitiesWindows: String,

        local: [propertyLocalSchema],
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