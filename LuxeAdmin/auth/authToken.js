"use strict";

var jwt = require('jsonwebtoken'),

    config = require('../../.config');

function generate(payload) {
    return jwt.sign(payload, config.jwtSecret);
}

function isValid(authToken) {
    var isValidToken;
    try {
        isValidToken = jwt.verify(authToken, config.jwtSecret, {
            algorithms: ["HS256"]
        });
    } catch (err) {
        isValidToken = false;
    }
    return isValidToken;
}

function decode(authToken) {
    if (!isValid(authToken)) {
        return null;
    }
    
    return jwt.decode(authToken, config.jwtSecret);
}

module.exports = {
    generate: generate,
    decode: decode,
    isValid: isValid
};