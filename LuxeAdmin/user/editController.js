/**
* Edits a User
*
* @module LuxeAdmin/user/editController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var async = require('async'),
    lodash = require('lodash'),
    
    cryptoHash = require('../utility/cryptoHash'),
    userModel = require('../datastore/userModel'),
    apiView = require('../apiView');

function editController(req, res) {
    
    var userId = req.params.userId,
        formInputs = res.body,
        updatedBy = req.auth._id;
    
    async.waterfall([
        function (callback) {
            // Get the User from MongoDB as a Mongoose Document
            userModel.findById(userId, callback);
        },
        function (userDoc, callback) {
            // If the user exists, proceed to hashing his/her password 
            // if it is provided.
            if (!userDoc) {
                return callback(new Error("User does not exist."));
            }
            
            if (formInputs.password) {
                return cryptoHash.hash(formInputs.password)
                    .then(function (hashedPassword) {
                        callback(null, hashedPassword, userDoc);
                    }, function (error) {
                        callback(error);
                    });
            }
            callback(null, null, userDoc);
        },
        function (hashedPassword, userDoc, callback) {
            // Update the user's information
            var userDetails = lodash.clone(formInputs);
            
            if (hashedPassword) {
                userDetails.password = hashedPassword;
            }
            
            userDoc.set(userDetails);
            userDoc.save(callback);
        }
    ], function (error, updatedUserDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        apiView(res, {
            message: "Succesfully edited the User.",
            data: updatedUserDoc.toObject()
        });
    });
    
}

module.exports = editController;