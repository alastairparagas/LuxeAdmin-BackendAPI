"use strict";

var apiView = require('../apiView');

function missingMiddleware(req, res, next) {
    apiView(res, {
        status: 404,
        message: "That API method/path does not exist!"
    });
}

module.exports = missingMiddleware;