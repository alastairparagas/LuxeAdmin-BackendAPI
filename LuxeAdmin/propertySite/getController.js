/**
* Gets the Property and associated PropertySite information
* 
* @module LuxeAdmin/propertySite/getController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var async = require('async'), 
    
    propertyModel = require('../datastore/propertyModel'),
    apiView = require('../apiView');

function getController(req, res) {
    
    var propertySiteId = req.params.propertySiteId;
    
    async.waterfall([
        function (callback) {
            // Get the Property from MongoDB
            propertyModel.findById(propertySiteId, callback);   
        },
        function (propertyDoc, callback) {
            // Populate the Property with its PropertySite
            propertyDoc.populate('propertySite', callback);
        }
    ], function (error, propertyDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        apiView(res, {
            message: propertyDoc.toObject()
        });
    });
    
}

module.exports = getController;