/**
* Edits a Property and its associated PropertySite. The PropertySite
* is updated as a side-effect.
*
* @module LuxeAdmin/propertySite/editController
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

function editController(req, res) {
    
    var propertySiteId = req.params.propertySiteId,
        formInputs = res.body,
        updatedBy = req.auth._id;
    
    async.waterfall([
        function (callback) {
            
            if (formInputs.hasOwnProperty('photos') && 
                !(formInputs.photos instanceof Array)) {
                return callback(new Error("Photos input must be an array."));
            }
            if (formInputs.hasOwnProperty('videos') && 
                !(formInputs.videos instanceof Array)) {
                return callback(new Error("Videos input must be an array."));
            }
            
            // Get the Property from MongoDB as a Mongoose Document
            propertyModel.findById(propertySiteId, callback);   
        },
        function (propertyDoc, callback) {
            // Update the Property
            var propertyDetails = lodash.clone(formInputs);
            
            propertyDoc.set(propertyDetails);
            propertyDoc.save(callback);
        },
        function (propertyDoc, callback) {
            // Get the PropertySite from MongoDB as a Mongoose Document
            propertySiteModel
                .findById(propertyDoc.propertySite, 
                          lodash.partialRight(callback, propertyDoc));
        },
        function (propertySiteDoc, propertyDoc, callback) {
            // Update the PropertySite
            var propertySiteDetails = lodash.clone(formInputs),
                propertySitePhotos = req.files.photos || [],
                propertySiteVideos = req.files.videos || [];
            
            propertySitePhotos.forEach(function (photo) {
                propertySiteDetails.photos.push(
                    propertySite.uploadedFileAbsoluteUrl(photo.filename)
                );
            });
            propertySiteVideos.forEach(function (video) {
                propertySiteDetails.videos.push(
                    propertySite.uploadedFileAbsoluteUrl(video.filename)
                );
            });
            
            propertySiteDoc.set(propertySiteDetails);
            propertySiteDoc.save(lodash.partialRight(callback, propertyDoc));
        },
        function (propertySiteDoc, propertyDoc, callback) {
            // Generate the PropertySite
            var dataFill = lodash.assign({},
                                         propertyDoc.toObject(),
                                         propertySiteDoc.toObject());
            
            propertySite.create(propertySiteDoc._id, dataFill)
                .then(function () {
                    callback(null, propertySiteDoc, propertyDoc);
                }, function (error) {
                    callback(error);
                });
        }
    ], function (error, updatedPropertySiteDoc, updatedPropertyDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }
        
        apiView(res, {
            message: "Succesfully edited the Property and " + 
                "corresponding PropertySite.",
            data: updatedPropertyDoc.toObject()
        });
    });
    
}

module.exports = editController;