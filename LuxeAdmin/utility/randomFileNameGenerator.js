/**
* Asynchronously generates a unique file name
* 
* @module LuxeAdmin/utility
* @param {string} storageDestination - Absolute path of file
* @param {string} fileExtension - File extension (to be appended at the
*   end of the file name)
* @param {Function} callback - 1st parameter passed is an error object 
*   (if there is an error) and 2nd parameter passed is the generated 
*   file name.
*/
"use strict";

var fsExtra = require('fs-extra'),
    path = require('path'),
    lodash = require('lodash');

function randomFileNameGenerator(storageDestination, fileExtension, callback) {
    
    var fileName = Date.now();
    
    fsExtra.stat(
            path.join(storageDestination, fileName), 
            function (err, stats) {
                
                var randomInt;
                
                if (!err && stats.isFile()) {
                    randomInt = lodash.random(1, 1000, false);
                }
                callback(null, String(fileName) + randomInt + fileExtension);
                
            });
    
}

module.exports = randomFileNameGenerator;