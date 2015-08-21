/**
* Mongoose Schema for an Administration user
* @module LuxeAdmin/datastore/userSchema
*/
"use strict";

var mongoose = require('mongoose'), 
    lodash = require('lodash'), 
    
    permission = require('../auth/permission'),
    timestampsPreHook = require('./middleware/timestampsPreHook'), 

    userSchema = new mongoose.Schema({
        username: String,
        email: String,
        name: String,
        password: String,
        permissions: {
            type: [String],
            validate: [
                function (inputArray) {
                    if (!Array.isArray(inputArray)) {
                        return false;   
                    }
                    
                    var allowedPermissions = 
                            new RegExp('^(' +  
                                       permission.permissions.join('|') + 
                                       ')$');
                    return lodash.every(inputArray, function (permission) {
                        return allowedPermissions.test(permission);
                    });
                },
                "User Permissions must be an array and must contain " +  
                "only valid permissions."
            ]
        },

        createdAt: Date,
        updatedAt: Date
    });

userSchema.pre('save', timestampsPreHook.save.bind(userSchema));
userSchema.pre('update', timestampsPreHook.update.bind(userSchema));

module.exports = userSchema;