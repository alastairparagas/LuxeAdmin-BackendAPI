/**
* Middleware sub-stack that checks if a user is logged in or not
*
* @module LuxeAdmin/auth/middleware/loggedIn
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/

var apiView = require('../../apiView');

function loggedIn(req, res, next) {
    
    var authPayload = req.auth;
    
    if (!authPayload || 
        !authPayload._id || 
        !authPayload.username || 
        !authPayload.email || 
        !Array.isArray(authPayload.permissions)) {
        
        return apiView(res, {
           status: 401,
            message: "Insufficient credentials. Please log in."
        });
        
    }
    
    next();
    
}

module.exports = loggedIn;