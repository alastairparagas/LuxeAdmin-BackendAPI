/**
* Handles settings for the upload of files/text fields
* @module LuxeAdmin/propertySite/uploadSettings
*/
"use strict";

var path = require('path'), 
    multer = require('multer'), 
    fsExtra = require('fs-extra'),
    lodash = require('lodash'),

    config = require('../../.config'), 


    /**
    * Where an uploaded file should be stored
    */
    storageDestination = path.join(process.cwd(), config.uploadPath),

    /**
    * What an uploaded files' name should be
    */
    storageFileName = function (req, file, callback) {

        var fileExtension,
            fileName = Date.now();

        switch(file.mimetype) {
            case "video/mp4": 
                fileExtension = ".mp4";
                break;
            case "image/png":
                fileExtension = ".png";
                break;
            case "image/jpg":
            case "image/jpeg":
                fileExtension = ".jpg";
                break;
            default:
                return callback(new Error("Unsupported file upload type." + 
                                          " Only .mp4, .png and .jpg " + 
                                          "files are allowed"));
        }

        // Ensure that a file with the generated fileName does not 
        // exist in the system. If it does, regenerate a new fileName
        fsExtra.stat(
            path.join(storageDestination, fileName), 
            function (err, stats) {
                
                var randomInt;
                
                if (!err && stats.isFile()) {
                    randomInt = lodash.random(1, 1000, false);
                }
                callback(null, String(fileName) + randomInt + fileExtension);
                
            });
    };



module.exports = {
    storage: multer.diskStorage({
        destination: storageDestination,
        filename: storageFileName
    })
};