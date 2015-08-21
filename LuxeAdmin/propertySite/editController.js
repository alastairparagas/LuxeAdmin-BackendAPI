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
            if (formInputs.hasOwnProperty('photoFiles') && 
                !(formInputs.photos instanceof Array)) {
                return callback(new Error("Photos input must be an array."));
            }
            if (formInputs.hasOwnProperty('videoFiles') && 
                !(formInputs.videos instanceof Array)) {
                return callback(new Error("Videos input must be an array."));
            }
            
            // Get the PropertySite from MongoDB as a Mongoose Document
            propertySiteModel.findById(propertySiteId, callback);   
        },
        function (propertySiteDoc, callback) {
            // Update the PropertySite
            if (!propertySiteDoc) {
                return callback(new Error("PropertySite does not exist."));   
            }
            
            var propertySiteDetails = lodash.clone(formInputs),
                propertySitePhotos = req.files.photoFiles || [],
                propertySiteVideos = req.files.videoFiles || [];
            
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
            propertySiteDoc.save(lodash.partialRight(callback, 
                                                     propertySiteDoc));
        },
        function (propertySiteDoc, callback) {
            // Get the Property from MongoDB as a Mongoose Document
            propertyModel
                .findById(propertySiteDoc.property, 
                          lodash.partialRight(callback, propertySiteDoc));
        },
        function (propertyDoc, propertySiteDoc, callback) {
            // Update the Property
            if (!propertyDoc) {
                return callback(new Error("Corresponding Property " + 
                                          "does not exist."));
            }
            
            var propertyDetails = lodash.clone(formInputs);
            
            propertyDoc.set(propertyDetails);
            propertyDoc.save(lodash.partialRight(callback, propertySiteDoc));
        },
        function (propertyDoc, propertySiteDoc, callback) {
            // Generate the PropertySite
            var dataFill = lodash.assign({},
                                         propertyDoc.toObject(),
                                         propertySiteDoc.toObject());
            
            propertySite.create(propertySiteDoc._id, dataFill)
                .then(function () {
                    callback(null, propertyDoc, propertySiteDoc);
                }, function (error) {
                    callback(error);
                });
        }
    ], function (error, updatedPropertyDoc, updatedPropertySiteDoc) {
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