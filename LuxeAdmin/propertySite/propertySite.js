/**
* Handles generation of PropertySites
*
* @module LuxeAdmin/propertySite/propertySite
*/
"use strict";

var fsWalk = require('fs-walk'),
    fsExtra = require('fs-extra'),
    fs = require('fs'),
    async = require('async'),
    mustache = require('mustache'),
    lodash = require('lodash'),
    
    path = require('path'),
    
    config = require('../../.config');

/**
* Generates a full path to the PropertySite Folder, provided a siteId
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
* @param {Object} dataFill - Object containing data used to parse the file
* @param {string} fileDir - Directory where the file is contained in
* @param {string} fileName - Name of the file currently being read
* @param {Object} fileState - Information about the file being read
* @param {Function} nextFileCallback - Function to call when done 
*   processing this file
*/
function _parse(siteId, dataFill, 
                 fileDir, fileName, fileStat, nextFileCallback) {
    
    var propertySiteFolder = propertySiteFolderPath(siteId),
        templateFolder = templateFolderPath(),
        templateFile = path.join(fileDir, fileName),
        propertySiteGeneratedFile = 
        path.join(propertySiteFolder, 
                  templateFile.replace(templateFolder, ""));
    
    async.waterfall([
        function (callback) {
            // Read Mustache files. Copy over any other kind of file
            var templateFileExtension = templateFile.split(".").pop();
                
            if (templateFileExtension === ".mst") {
                fs.readFile(templateFile, {encoding: 'utf-8'}, callback);
            }
            fsExtra.copy(templateFile, propertySiteGeneratedFile, callback);
        }, 
        function (fileContents, callback) {
            // Parse Mustache files by filling in the templates
            if (!fileContents) {
                return callback();   
            }
            
            var parsedFileContents = mustache.render(fileContents, dataFill);
            fs.writeFile(propertySiteGeneratedFile, 
                         parsedFileContents, callback);
        }
    ], nextFileCallback);
    
}

/**
* Creates a PropertySite
* @param {String} siteId - ID of the PropertySite
* @param {Object} dataFill - Data to fill for the PropertySite
* @returns {Object} Promise
*/
function create(siteId, dataFill) {
    
    var propertySiteFolder = propertySiteFolderPath(siteId),
        templateFolder = templateFolderPath();

    function promiseExecutor(resolve, reject) {
        async.waterfall([
            function (callback) {
                fsExtra.mkdirs(propertySiteFolder, callback);  
            },
            function (callback) {
                fsWalk.files(templateFolder, 
                             _parse.bind(null, siteId, dataFill), 
                             callback);
            }
        ], function (error) {
            if (error) {
                fsExtra.remove(propertySiteFolder);
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