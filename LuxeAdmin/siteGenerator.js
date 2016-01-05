/**
* Handles generation of Sites
* @module LuxeAdmin/propertySite/propertySite
*/
"use strict";

var fsWalk = require('fs-walk'),
    fsExtra = require('fs-extra'),
    async = require('async'),
    mustache = require('mustache'),
    
    path = require('path'),
    
    config = require('../../.config');

/**
* Generates a full path to a Site Folder, provided a siteId
* @param {string} siteId - ID of PropertySite
* @returns {string} Full path to the PropertySite
*/
function propertySiteFolderPath(siteId) {
    return path.join(process.cwd(), config.staticFilesPath, siteId);
}

/**
* Generates a full path to the template folder used for PropertySites
* @returns {string} Full path to the Templates folder
*/
function templateFolderPath() {
    return path.join(process.cwd(), config.templateFilesPath);
}

/**
* Generates an absolute url path (including domain name) for an uploaded file 
*   e.g. video, audio, images, etc. for a PropertySite
*
* @param {string} fileName - File name of uploaded file
* @returns {string} Full URL for an uploaded file
*/
function uploadedFileAbsoluteUrl(fileName) {
    return path.join(config.domainName, 
                     config.uploadPath.replace(config.staticFilesPath, 
                                               ""), fileName);
}

/**
* Parses a file in the template folder to generate the corresponding 
*   PropertySite file.
*
* @private
* @param {string} siteId - ID of the PropertySite
* @param {Object} dataFill - Object containing data used to 
*   parse the template file
* @param {string} templateFilesDir - Directory where the file is contained in
* @param {string} generatedFilesDir - Directory where the generated 
* @param {string} fileName - Name of the file currently being read
* @param {Object} fileStat - Information about the file being read
* @param {Function} nextFileCallback - Function to call when done 
*   processing this file
*/
function _parse(siteId, dataFill, templateFilesDir, generatedFilesDir, 
                 currentFileDir, currentFileName, fileStat, nextFileCallback) {
    
    var templateFile = path.join(currentFileDir, currentFileName),
        generatedFile = path.join(generatedFilesDir, currentFileName);
    
    async.waterfall([
        function (callback) {
            // Check for file extension of a file.
            // If it is a mustache file (.mst), read it, else just copy over
            var templateFileExtension = templateFile.split(".").pop();
                
            if (templateFileExtension === ".mst") {
                fsExtra.readFile(templateFile, {encoding: 'utf-8'}, 
                                 callback);
            } else {
                fsExtra.copy(templateFile, generatedFile, 
                             callback);
            }
        }, 
        function (fileContents, callback) {
            // Parse a read Mustache file by filling in the template's variables
            if (!fileContents) {
                return callback();   
            }
            
            var parsedFileContents = mustache.render(fileContents, dataFill),
                templateFileExtension = templateFile.split(".");
            
            if (templateFileExtension === "") {
                   
            }
            
            fsExtra.writeFile(generatedFile, 
                              parsedFileContents, callback);
        }
    ], nextFileCallback);
    
}

/**
* Creates a PropertySite
* @param {string} siteId - ID of the PropertySite
* @param {Object} dataFill - Data to fill for the PropertySite
* @param {string} templateFilesDir - Absolute location of template files
* @param {string} generatedFilesDir - Absolute location of where to store
*   files generated from templates.
* @returns {Object} Promise
*/
function create(siteId, dataFill, templateFilesDir, generatedFilesDir) {

    function promiseExecutor(resolve, reject) {
        async.waterfall([
            function (callback) {
                fsExtra.mkdirs(generatedFilesDir, callback);  
            },
            function (callback) {
                fsWalk.files(templateFilesDir, 
                             _parse.bind(null, siteId, dataFill, 
                                         generatedFilesDir), 
                             callback);
            }
        ], function (error) {
            if (error) {
                fsExtra.remove(templateFilesDir);
                return reject(error);   
            }
            resolve();
        });
    }

    return new Promise(promiseExecutor);

}

/**
* Removes a PropertySite
* @param {String} siteId - ID of the PropertySite
* @returns {Object} Promise
*/
function remove(siteId) {
    
    var propertySiteFolder = propertySiteFolderPath(siteId);
    
    function promiseExecutor(resolve, reject) {
        fsExtra.remove(propertySiteFolder, function (error) {
            if (error) {
                return reject(error);   
            }
            resolve();
        });
    }
    
    return new Promise(promiseExecutor);
    
}

/**
* Updates a PropertySite
* @param {String} siteId - ID of the PropertySite
* @param {Object} dataFill - Object containing data used to parse the file
* @returns {Object} Promise
*/
function update(siteId, dataFill) {
    
    return remove(siteId).then(function () {
        return create(siteId, dataFill); 
    });
    
}

module.exports = {
    propertySiteFolderPath: propertySiteFolderPath,
    templateFolderPath: templateFolderPath,
    uploadedFileAbsoluteUrl: uploadedFileAbsoluteUrl,
    create: create,
    remove: remove,
    update: update
};