/**
* Mongoose Schema for a website of a property
* @module LuxeAdmin/datastore/propertySiteSchema
*/
"use strict";

var mongoose = require('mongoose'),
    
    timestampsPreHook = require('./middleware/timestampsPreHook'),
    
    propertySiteSchema = mongoose.Schema({
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true
        },
        homePageIntroduction: String,
        homePageTagline: String,
        homePageDescription: String,
        detailedDescription: String,
        
        photos: [String],
        vidoes: [String],
        
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true
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

propertySiteSchema.pre('save', 
                       timestampsPreHook.save.bind(propertySiteSchema));
propertySiteSchema.pre('update', 
                       timestampsPreHook.update.bind(propertySiteSchema));

module.exports = propertySiteSchema;