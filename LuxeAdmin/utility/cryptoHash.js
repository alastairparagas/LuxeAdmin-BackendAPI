/**
* Utility module that handles one-way encryption of data
*
* @module LuxeAdmin/auth/crypto
*/
"use strict";

var bcrypt = require('bcrypt'),
    async = require('async');

/**
* Stringifies the payload
* @private
* @param {string} payload - Thing to stringify
* @returns {string} Stringified version of the payload
*/
function _stringify(payload) {
    
    var payloadString;
    
    if (typeof payload === "string") {
        return payload;   
    }
    
    if (payload instanceof Object) {
        payloadString = JSON.stringify(payload);
    } else {
        payloadString = String(payload);
    }
    
    return payloadString;
    
}

/**
* Hashes payload for safe, irreversible storage and usage
* @param {string} payload - Thing to hash
* @returns {Object} Promise
*/
function hash(payload) {
    
    var payloadString = _stringify(payload);
    
    function promiseExecutor(resolve, reject) {
        
        async.waterfall([
            function (callback) {
                bcrypt.genSalt(14, callback);
            },
            function (salt, callback) {
                bcrypt.hash(payloadString, salt, callback);
            }
        ], function (error, hash) {
            if (error) {
                return reject(error);   
            }
            
            resolve(hash);
        });
    }
    
    return new Promise(promiseExecutor);
    
}

/**
* Compares plaintext against the hashed string
* @param {string} plainText - Text to compare with
* @param {string} encrypted - Hash to compare against
* @returns {Object} Promise
*/
function compare(plaintext, encrypted) {
    
    var payloadString = _stringify(plaintext);
    
    function promiseExecutor(resolve, reject) {
     
        async.waterfall([
            function (callback) {
                bcrypt.compare(payloadString, encrypted, callback);
            }
        ], function (error, booleanResult) {
            if (error) {
                return reject(error);   
            }
            
            resolve(booleanResult);
        });
        
    }
    
    return new Promise(promiseExecutor);
    
}

module.exports = {
    hash: hash,
    compare: compare
};