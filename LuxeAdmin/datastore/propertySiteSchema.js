/**
* Mongoose Schema for a website of a property
* @module LuxeAdmin/datastore/propertySiteSchema
*/
"use strict";

var mongoose = require('mongoose'),
    
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

propertySiteSchema.pre('save', function(next){
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    next();
});
propertySiteSchema.pre('update', function() {
    this.update({
        updatedAt: Date.now()
    });
});

module.exports = propertySiteSchema;