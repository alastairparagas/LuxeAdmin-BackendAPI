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