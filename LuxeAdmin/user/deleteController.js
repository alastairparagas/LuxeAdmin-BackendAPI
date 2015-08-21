/**
* Delete the user
* 
* @module LuxeAdmin/user/deleteController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var async = require('async'),
    
    userModel = require('../datastore/userModel'),
    apiView = require('../apiView');

function deleteController(req, res) {
    
    var userId = req.params.userId;
    
    async.waterfall([
        function (callback) {
            userModel.findByIdAndRemove(callback);
        }
    ], function (error, userDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        apiView(res, {
            status: 200,
            message: userDoc.toObject()
        });
    });
    
}

module.exports = deleteController;