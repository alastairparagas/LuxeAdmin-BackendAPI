/**
* Middleware that handles making responses for "missing" routes.
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
* @param {Function} next - Express middleware callback
*/
"use strict";

var apiView = require('../apiView');

function missingMiddleware(req, res, next) {
    apiView(res, {
        status: 404,
        message: "That API method/path does not exist!"
    });
}

module.exports = missingMiddleware;