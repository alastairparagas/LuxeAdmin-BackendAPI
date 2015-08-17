/**
* Creates the Property, then the associated PropertySite for the Property.
* Associates the Property and PropertySite with each other 
* (for populations later), then associate uploaded images/videos to the
* PropertySite. Finally, local businesses are then searched with Yelp and 
* added to the Property.

* @module LuxeAdmin/propertySite/createController
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
"use strict";

var config = require('../../.config'),

    lodash = require('lodash'), 
    async = require('async'),

    createPropertySite = require('./createPropertySite'), 
    propertyLocal = require('./propertyLocal'), 
    apiView = require('../apiView'), 
    propertyModel = require('../datastore/propertyModel'), 
    propertySiteModel = require('../datastore/propertySiteModel');

function createController(req, res) {

    var formInputs = res.body;
    formInputs.createdBy = req.auth._id;

    async.waterfall([
        function (callback) {
            var propertyDetails = lodash.clone(formInputs);

            propertyModel.create(propertyDetails, 
                                 function (error, newPropertyDoc) {
                if (error) {
                    return callback(error);
                }
                callback(null, newPropertyDoc);
            });
        }, 
        function (newPropertyDoc, callback) {
            newPropertyDoc.propertySite = newPropertyDoc._id;
            newPropertyDoc.save(function (error, newPropertyDoc) {
                if (error) {
                    return callback(error);
                }
                callback(null, newPropertyDoc);
            });
        }, 
        function (newPropertyDoc, callback) {
            var propertySiteDetails = lodash.clone(formInputs);
            propertySiteDetails._id = newPropertyDoc._id;
            propertySiteDetails.property = newPropertyDoc._id;
            propertySiteDetails.photos = [];
            propertySiteDetails.videos = [];

            var propertySitePhotos = req.files.photos,
                propertySiteVideos = req.files.videos;

            if (propertySitePhotos && Array.isArray(propertySitePhotos)) {
                propertySitePhotos.forEach(function (photo) {
                    propertySiteDetails.photos.push(photo.filename);
                });
            }

            if (propertySiteVideos && Array.isArray(propertySiteVideos)) {
                propertySiteVideos.forEach(function (video) {
                    propertySiteDetails.videos.push(video.filename); 
                });
            }

            propertySiteModel.create(propertySiteDetails, 
                                     function (error, newPropertySiteDoc) {
                if (error) {
                    return callback(error);   
                }
                callback(null, newPropertyDoc, newPropertySiteDoc);
            });
        }, 
        function (newPropertyDoc, newPropertySiteDoc, callback) {
            propertyLocal.then(function (localData) {
                callback(null, localData);
            }, function (error) {
                callback(error);   
            });
        }, 
        function (newPropertyDoc, newPropertySiteDoc, localData, 
                   callback) {
            newPropertyDoc.local = localData;
            newPropertyDoc.save(function (error, newPropertyDoc) {
                if (error) {
                    return callback(error);   
                }
                callback(null, newPropertyDoc, newPropertySiteDoc);
            });
        }, 
    ], function (err, newPropertyDoc, newPropertySiteDoc) {
        if (err) {
            return apiView(res, {
                status: 400,
                message: err.message
            });
        }

        apiView(res, {
            message: "Succesfully added a new Property and Property Site!",
            data: newPropertyDoc.toObject()
        });
    });

}

module.exports = createController;