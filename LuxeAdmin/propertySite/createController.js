/**
* Creates the Property, then the associated PropertySite for the Property.
* Associates the Property and PropertySite with each other 
* (for populations later), then associate uploaded images/videos to the
* PropertySite. Finally, local businesses are then searched with Yelp and 
* added to the Property.
*
* @module LuxeAdmin/propertySite/createController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var config = require('../../.config'),

    async = require('async'),
    lodash = require('lodash'), 
    
    propertyLocal = require('./propertyLocal'), 
    propertySite = require('./propertySite'), 
    apiView = require('../apiView'), 
    propertyModel = require('../datastore/propertyModel'), 
    propertySiteModel = require('../datastore/propertySiteModel');

function createController(req, res) {

    var formInputs = res.body;
    formInputs.createdBy = req.auth._id;

    async.waterfall([
        function (callback) {
            // Create the Property in MongoDB
            var propertyDetails = lodash.clone(formInputs);

            propertyModel.create(propertyDetails, callback);
        }, 
        function (newPropertyDoc, callback) {
            // Make the relation between the Property and PropertySite
            newPropertyDoc.propertySite = newPropertyDoc._id;
            newPropertyDoc.save(callback);
        }, 
        function (newPropertyDoc, callback) {
            // Create the PropertySite in MongoDB
            var propertySiteDetails = lodash.clone(formInputs);
            propertySiteDetails._id = newPropertyDoc._id;
            propertySiteDetails.property = newPropertyDoc._id;
            propertySiteDetails.photos = [];
            propertySiteDetails.videos = [];

            var propertySitePhotos = req.files.photoFiles || [],
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

            propertySiteModel
                .create(propertySiteDetails, 
                        lodash.partialRight(callback, newPropertyDoc));
        }, 
        function (newPropertySiteDoc, newPropertyDoc, callback) {
            // Use the propertyLocal module to get all the high quality local
            // areas of interest in a PropertyLocal schema-abiding way
            propertyLocal.then(function (localData) {
                callback(null, newPropertySiteDoc, newPropertyDoc, localData);
            }, function (error) {
                callback(error);
            });
        }, 
        function (newPropertySiteDoc, newPropertyDoc, localData, 
                   callback) {
            // Save the propertyLocal module obtained information to MongoDB
            newPropertyDoc.local = localData;
            newPropertyDoc.save(
                lodash.partialRight(callback, newPropertySiteDoc)
            );
        }, 
        function (newPropertyDoc, newPropertySiteDoc, callback) {
            // Generate the PropertySite
            var dataFill = lodash.assign({}, 
                                         newPropertyDoc.toObject(), 
                                         newPropertySiteDoc.toObject());
            
            propertySite.create(newPropertySiteDoc._id, dataFill)
                .then(function () {
                    callback(null, newPropertyDoc, newPropertySiteDoc);
                }, function (error) {
                    callback(error);
                });
            
        }
    ], function (error, newPropertyDoc, newPropertySiteDoc) {
        if (error) {
            return apiView(res, {
                status: 400,
                message: error.message
            });
        }

        apiView(res, {
            message: "Succesfully added a new Property and Property Site.",
            data: newPropertyDoc.toObject()
        });
    });

}

module.exports = createController;