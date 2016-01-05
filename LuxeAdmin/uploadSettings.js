/**
* Handles settings for the upload of files/text fields
* @module LuxeAdmin/uploadSettings
*/
"use strict";

var path = require('path'), 
    multer = require('multer'), 
    
    randomFileNameGenerator = require('utility/randomFileNameGenerator'),
    config = require('../.config'), 


    /**
    * Where an uploaded file should be stored
    */
    storageDestination = path.join(process.cwd(), config.uploadPath),

    /**
    * What an uploaded files' name should be
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
        
        randomFileNameGenerator(storageDestination, fileExtension, callback);
        
    };



module.exports = {
    storage: multer.diskStorage({
        destination: storageDestination,
        filename: storageFileName
    })
};