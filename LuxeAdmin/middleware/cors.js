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