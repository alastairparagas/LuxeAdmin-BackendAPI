/**
* Handles settings for the upload of files/text fields on PropertySite routes
* @module LuxeAdmin/propertySite/uploadSettings
*/
"use strict";

var path = require('path'), 
    multer = require('multer'), 
    
    config = require('../../.config'), 
    

    /**
    * Where the uploaded files should be stored
    */
    storageDestination = path.join(process.cwd(), config.uploadPath),

    /**
    * What the uploaded files' name should be
    */
    storageFileName = function (req, file, callback) {
        var fileExtension;
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
        callback(null, Date.now() + fileExtension);
    };



module.exports = {
    storage: multer.diskStorage({
        destination: storageDestination,
        filename: storageFileName
    })
};