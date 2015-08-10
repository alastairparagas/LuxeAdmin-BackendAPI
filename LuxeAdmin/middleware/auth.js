/**
* Middleware that blocks a request if it does not contain a JSON Web Token 
*   Authorization header. If the request does contain a JWT token, load the 
*   payload on the auth property of the Express Request Object and continue 
*   the request cycle.
* @module LuxeAdmin/middleware/auth
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
"use strict";

var lodash = require('lodash'),
    
    authToken = require('../auth/authToken'), 
    apiView = require('../apiView');

function auth(req, res, next) {
    var authHeaders = req.get('Authorization'),
        tokenString = authHeaders && authHeaders.split(" ")[1],
        decodedAuthToken;

    if (!authHeaders || !tokenString) {
        return apiView(res, {
            status: 403,
            message: "Unauthorized. No authentication credentials."
        });
    }

    decodedAuthToken = authToken.decode(tokenString);

    if (!decodedAuthToken) {
        return apiView(res, {
            status: 403,
            message: "Unauthorized. Invalid Token."
        });
    }

    req.auth = decodedAuthToken;
    lodash.merge(res.apiView, {
       data: {
            authToken: authToken.generate(decodedAuthToken)   
       }
    });
    next();
}

module.exports = auth;