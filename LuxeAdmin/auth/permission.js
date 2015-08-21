/**
* Utility module that handles administration app permissions
* 
* @module LuxeAdmin/auth/permission
*/
"use strict";

var lodash = require('lodash');

/**
* Array of possible permissions available for this app
*/
var permissions = ['isSuperAdmin', 'isSiteAdmin', 'isSiteCreator', 
                   'isUserAdmin'];

/**
* Checks if a user has permission
* @param {String[]} permissions - Array of permissions that are allowed
* @param {String[]} userPermissions - Array of a user's permission set
* @return {boolean} TRUE if user has the permission, FALSE otherwise
*/
function hasPermission(permissions, userPermissions) {
    
    if (!(permissions instanceof Array && 
          userPermissions instanceof Array)) {
        throw new Error("permissions and userPermissions must be an array");
    }
    
    if (permissions.length === 0) {
        return true;   
    }
    
    var allowedPermissions = new RegExp(
        '^(' + permissions.join('|') + ')$');
    
    return lodash.some(userPermissions, function (permission) {
        return allowedPermissions.test(permission); 
    });
    
}

module.exports = {
    permissions: lodash.clone(permissions),
    hasPermission: hasPermission
};