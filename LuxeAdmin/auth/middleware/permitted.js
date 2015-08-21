/**
* Module of Middleware sub-stacks that checks if a user is permitted 
* to do a certain action.
*
* @module LuxeAdmin/propertySite/middleware/permitted
*/
"use strict";

var permission = require('../permission'), 
    apiView = require('../../apiView');

/**
* Processes the request and accepts/denies user based on the permission 
* level he/she has.
* @private
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
* @param {String[]} allowedPermissions - array of allowed permissions 
*   for the request.
*/
function _permissionCheck(req, res, next, allowedPermissions) {
    
    var userPermissions = req.auth.permissions;
    
    if (permission.hasPermission(allowedPermissions, userPermissions)) {
        return apiView(res, {
            status: 401,
            message: "Insufficient permission."
        });
    }
    
    next();
}

/**
* Middleware that checks if a user is permitted to create PropertySites
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
function propertySiteCreation(req, res, next) {
    
    var allowedPermissions = ['isSuperAdmin', 'isSiteAdmin', 
                              'isSiteCreator'];
    
    _permissionCheck(req, res, next, allowedPermissions);
    
}

/**
* Middleware that checks if a user can get PropertySite information
*/
function propertySiteGet(req, res, next) {
    next();
}

/**
* Middleware that checks if a user is permitted to edit a PropertySite
* "Editing" involves updating a currently existing PropertySite as well 
* as deleting it.
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
function propertySiteEditing(req, res, next) {
    
    var allowedPermissions = ['isSuperAdmin', 'isSiteAdmin', 
                              'isSiteCreator'];
    
    _permissionCheck(req, res, next, allowedPermissions);
    
}

/**
* Middleware that checks if a user is permitted to create a user
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
function userCreation(req, res, next) {
    
    var allowedPermissions = ['isSuperAdmin', 'isUserAdmin'];
    
    _permissionCheck(req, res, next, allowedPermissions);
    
}

/**
* Middleware that checks if user information can be obtained by a user
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
function userGet(req, res, next) {
    next();
}

/**
* Middleware that checks if a user is permitted to edit a user.
* "Editing" involves updating a currently existing user as well as 
* deleting it.
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
function userEditing(req, res, next) {
    
    var allowedPermissions = ['isSuperAdmin', 'isUserAdmin'];
    
    _permissionCheck(req, res, next, allowedPermissions);
    
}

module.exports = {
    propertySiteCreation: propertySiteCreation,
    propertySiteGet: propertySiteGet,
    propertySiteEditing: propertySiteEditing,
    userCreation: userCreation,
    userGet: userGet,
    userEditing: userEditing
};