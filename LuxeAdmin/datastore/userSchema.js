/**
* Mongoose Schema for an Administration user
* @module LuxeAdmin/datastore/userSchema
*/
"use strict";

var mongoose = require('mongoose'), 
    lodash = require('lodash'), 
    
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
                            new RegExp('^(isSuperAdmin|' + 
                                       'isSiteAdmin|' + 
                                       'isUserAdmin|' + 
                                       'isSiteCreator)$');
                    lodash.every(inputArray, function (permission) {
                        return allowedPermissions.test(permission);
                    });
                },
                "User Permissions must be an array and either have " + 
                "isSuperAdmin, isSiteAdmin, " + 
                "isUserAdmin and/or isSiteCreator"
            ]
        },

        createdAt: Date,
        updatedAt: Date
    });

userSchema.pre('save', timestampsPreHook.save.bind(userSchema));
userSchema.pre('update', timestampsPreHook.update.bind(userSchema));

module.exports = userSchema;