/**
* Mongoose Schema for a property (house, apartment, etc.)
* @module LuxeAdmin/datastore/propertySchema
*/
"use strict";

var mongoose = require('mongoose'),
    
    propertyLocalSchema = require('./propertyLocalSchema'),
    timestampsPreHook = require('./middleware/timestampsPreHook'),

    propertySchema = new mongoose.Schema({
        propertyType: {
            type: String,
            required: true,
            validate: function () {
                
            }
        }, 
        price: {
            type: Number, 
            required: true
        }, 
        address: {
            type: String,
            required: true
        }, 
        city: {
            type: String, 
            required: true
        }, 
        state: {
            type: String,
            required: true
        }, 
        postalCode: {
            type: Number,
            required: true
        }, 
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
            ref: 'User',
            required: true
        },
        updatedAt: Date,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    });

propertySchema.pre('save', timestampsPreHook.save.bind(propertySchema));
propertySchema.pre('update', timestampsPreHook.update.bind(propertySchema));

module.exports = propertySchema;