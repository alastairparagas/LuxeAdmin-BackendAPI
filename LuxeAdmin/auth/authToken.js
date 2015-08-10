/**
* Handles creating, validating and decoding JSON Web Tokens
* @module LuxeAdmin/auth/authToken
*/
"use strict";

var jwt = require('jsonwebtoken'),

    config = require('../../.config');

/**
* Generates a JSON Web Token with the provided payload
* @param {Object} payload - Auth information to store in the JSON Web Token
* @returns {string} Generated JSON Web Token
*/
function generate(payload) {
    return jwt.sign(payload, config.jwtSecret);
}

/**
* Validates if a JSON Web Token is valid or not
* @param {string} authToken - JSON Web Token to check if valid or not
* @returns {boolean} TRUE if token is valid, FALSE if not
*/
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

/**
* Decodes the JSON Web Token and returns its payload
* @param {string} authToken - JSON Web Token to decode
* @returns {Object} Payload contents of the JSON Web Token
*/
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