/**
* Gets information about the user
*
* @module LuxeAdmin/user/getController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var lodash = require('lodash'),
    async = require('async'),
    
    userModel = require('../datastore/userModel'),
    apiView = require('../apiView');

function getController(req, res) {
    
    var userId = req.params.userId;
    
    async.waterfall([
        function (callback) {
            userModel.findById(userId, callback);
        }
    ], function (error, userDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        var userDetails = lodash.omit(userDoc.toObject(), "password");
        
        apiView(res, {
            message: "Succesfully obtained User information.",
            data: userDetails
        });
    });
    
}