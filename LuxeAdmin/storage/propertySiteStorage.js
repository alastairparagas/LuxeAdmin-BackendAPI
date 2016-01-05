/**
* Handles the storage of propertySite information
*
* @module LuxeAdmin/storage/propertySite
*/
"use strict";

var lodash = require('lodash'), 
    
    propertySiteSchema = require('../datastore/propertySiteSchema'), 
    propertySiteModel = require('../datastore/propertySiteModel');

/**
* Creates a new PropertySite
* @param {string} newPropertySiteDetails - new PropertySite details
* @returns {Object} Promise
*/
function create(newPropertySiteDetails) {
    
    function promiseExecutor(resolve, reject) {
        propertySiteModel
            .create(newPropertySiteDetails)
            .then(resolve, reject);
    }
    
    return new Promise(promiseExecutor);
}

/**
* Gets the PropertySite of specified propertySiteId
* @param {string} propertySiteId - ID of PropertySite being obtained
* @param {Object} Promise
*/
function get(propertySiteId) {
    
    function promiseExecutor(resolve, reject) {
        propertySiteModel
            .findOne(propertySiteId)
            .then(resolve, reject);
    }
    
    return new Promise(promiseExecutor);
}

/**
* Gets the PropertySite along with populated information (relations)
* @param {string} propertySiteId - ID of the PropertySite being obtained
* @param {String[]} propertiesRefList - Array of properties 
*   acting as references. If no propertiesRefList is provided, 
*   all the references will be populated.
* @returns {Object} Promise
*/
function getRelated(propertySiteId, propertiesRefList) {
    
    var populationList;
    
    if (Array.isArray(propertiesRefList)) {
        populationList = propertiesRefList.join(" ");
    }
    
    function promiseExecutor(resolve, reject) {
        var query = 
            propertySiteModel.findOne(propertySiteId);
        
        if (populationList) {
            query.populate(populationList);   
        }
        
        query.then(resolve, reject);
    }
    
    return new Promise(promiseExecutor);
}

/**
* Updates the PropertySite of specified propertySiteId with 
*   updatedPropertySiteDetails
* @param {string} propertySiteId - ID of the PropertySite being updated
* @param {object} updatedPropertySiteDetails - updated PropertySite 
*   details (mapping of property to change with values to set)
* @returns {Object} Promise
*/
function update(propertySiteId, updatedPropertySiteDetails) {
    
    function promiseExecutor(resolve, reject) {
        var query = 
            propertySiteModel.findOne();
    }
    
    return new Promise(promiseExecutor);
}

/**
* Removes the PropertySite of specificed propertySiteId
* @param {string} propertySiteId - ID of the PropertySite being removed
* @returns {Object} Promise
*/
function remove(propertySiteId) {
    
    function promiseExecutor(resolve, reject) {
        
    }
    
    return new Promise(promiseExecutor);
}

module.exports = {
    create: create,
    get: get,
    getRelated: getRelated,
    update: update,
    remove: remove
};