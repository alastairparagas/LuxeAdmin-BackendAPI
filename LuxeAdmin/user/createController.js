/**
* Handles the creation of a user
*
* @module LuxeAdmin/user/createController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var lodash = require('lodash'),
    async = require('async'),
    
    cryptoHash = require('../utility/cryptoHash'),
    userModel = require('../datastore/userModel'),
    apiView = require('../apiView');

function createController(req, res) {
    
    var formInputs = req.body;
    formInputs.createdBy = req.auth._id;
    
    async.waterfall([
        function (callback) {
            // Check if user with the username already exists in database
            userModel.findOne({username: formInputs.username}, callback);
        },
        function (userDoc, callback) {
            // Check if user with the email already exists in database
            if (userDoc) {
                return callback(new Error("That user already exists."));
            }
            
            userModel.findOne({email: formInputs.email}, callback);
        },
        function (userDoc, callback) {
            // If the user does not yet exist, proceed to hashing his/her 
            // password
            if (userDoc) {
                return callback(new Error("That user already exists."));   
            }
            
            cryptoHash.hash(formInputs.password)
                .then(function (hashedPassword) {
                    callback(null, hashedPassword, userDoc);
                }, function (error) {
                    callback(error);
                });
        },
        function (hashedPassword, userDoc, callback) {
            // Create the user
            var userDetails = lodash.clone(formInputs);
            userDetails.password = hashedPassword;
            
            userModel.create(userDetails, callback);
        }
    ], function (error, userDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        apiView(res, {
            message: "Succesfully added a new User.",
            data: userDoc.toObject()
        });
    });
    
}