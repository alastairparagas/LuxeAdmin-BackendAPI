/**
* Handles the login process of an Administration user
* @module LuxeAdmin/auth/loginController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var lodash = require('lodash'), 
    async = require('async'),
    
    authToken = require('./authToken'), 
    cryptoHash = require('../utility/cryptoHash'),
    apiView = require('../apiView'),
    userModel = require('../datastore/userModel');

function loginController(req, res) {
    
    var userIdentifier = req.body.useridentifier,
        userPassword = req.body.userpassword,
        
        errorMessage = "That username/password combination " +  
                                "does not exist";

    async.waterfall([
        function (callback) {
            userModel.findOne({username: userIdentifier}, callback);
        },
        function (userDoc, callback) {
            if (!userDoc) {
                return callback(new Error(errorMessage));
            }
            
            callback(null, userDoc);
        },
        function (userDoc, callback) {
            cryptoHash.compare(userPassword, userDoc.password)
                .then(function (comparisonResult) {
                    callback(null, comparisonResult, userDoc);
                }, function (error) {
                    callback(new Error(errorMessage));
                });
        },
        function (comparisonResult, userDoc, callback) {
            if (!comparisonResult) {
                callback(new Error(errorMessage));
            }
            
            callback(null, userDoc);
        }
    ], function (error, userDoc) {
        if (error) {
            return apiView(res, {
                status: 401,
                message: error.message
            });
        }
        
        var userInfo = userDoc.toObject(), 
            tokenPayload = lodash.pick(userInfo, ['_id', 
                                                  'username', 
                                                  'permissions', 
                                                  'email']);
        
        apiView(res, {
            status: 200,
            message: "Succesfully authenticated!",
            data: lodash.merge({
                authToken: authToken.generate(tokenPayload)
            }, userInfo)
        });
    });

}

module.exports = loginController;