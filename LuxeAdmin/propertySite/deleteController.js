/**
* Deletes the Property along with the associated PropertySite
*
* @module LuxeAdmin/propertySite/deleteController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var async = require('async'),
    lodash = require('lodash'),
    
    propertySite = require('./propertySite'),
    apiView = require('../apiView'),
    propertySiteModel = require('../datastore/propertySiteModel'),
    propertyModel = require('../datastore/propertyModel');

function deleteController(req, res) {
    
    var propertySiteId = req.params.propertySiteId;
    
    async.waterfall([
        function (callback) {
            // Get the Property from MongoDB as a Mongoose Document
            propertySiteModel.findByIdAndRemove(propertySiteId, callback);
        },
        function (propertySiteDoc, callback) {
            // Delete the Property and associated PropertySite
            var propertySiteId = propertySiteDoc.property;
            
            propertyModel
                .findByIdAndRemove(propertySiteId, 
                                   lodash.partialRight(callback, 
                                                       propertySiteDoc));
        },
        function (propertyDoc, propertySiteDoc, callback) {
            // Delete the generated PropertySite
            propertySite.remove(propertySiteDoc._id)
                .then(function () {
                    callback(null, propertyDoc, propertySiteDoc);    
                }, function (error) {
                    callback(error);
                });
        }
    ], function (error, deletedPropertyDoc, deletedPropertySiteDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        apiView(res, {
            message: "Succesfully deleted Property and Property Site.",
            data: deletedPropertyDoc.toObject()
        });
    });
    
}

module.exports = deleteController;