/**
* Middleware that allows CORS requests to be made. If an OPTIONS request 
*   method is made, return a status 200. The browser makes a pre-flight 200 
*   call just to make sure that it can connect with the server.
* @module LuxeAdmin/middleware/cors
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
"use strict";

var apiView = require('../apiView');

function corsMiddleware(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 
        'X-Requested-With, Content-Type, Authorization, Accept, Origin'
    });

    if (req.method === "OPTIONS") {
        return apiView(res, {
            status: 200
        });
    }

    next();
}

module.exports = corsMiddleware;