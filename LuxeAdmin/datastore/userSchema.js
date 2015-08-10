/**
* Mongoose Schema for an Administration user
* @module LuxeAdmin/datastore/userSchema
*/
"use strict";

var mongoose = require('mongoose'), 
    
    userSchema = new mongoose.Schema({
        username: String,
        email: String,
        name: String,
        password: String,
        permissions: [String],
        
        createdAt: Date,
        updatedAt: Date
    });

userSchema.pre('save', function(next){
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    next();
});
userSchema.pre('update', function() {
    this.update({
        updatedAt: Date.now()
    });
});

module.exports = userSchema;