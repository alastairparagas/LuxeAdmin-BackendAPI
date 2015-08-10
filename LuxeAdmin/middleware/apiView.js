/**
* Middleware that allows us to attach data that needs to be 
*   mounted on the response the API makes.
* @module LuxeAdmin/middleware/apiView
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback.
*/
"use strict";

function responseDataMiddleware(req, res, next) {
    if (!res.hasOwnProperty('apiViewData')) {
        res.apiView = {};
    }
}

module.exports = responseDataMiddleware;