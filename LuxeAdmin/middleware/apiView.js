"use strict";

function responseDataMiddleware(req, res, next) {
    if (!res.hasOwnProperty('apiViewData')) {
        res.apiView = {};
    }
}

module.exports = responseDataMiddleware;