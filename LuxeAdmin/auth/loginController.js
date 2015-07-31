"use strict";

var lodash = require('lodash'), 
    
    authToken = require('./authToken'), 
    apiView = require('../apiView'),
    userModel = require('../datastore/userModel');

function loginController(req, res) {

    userModel
        .findOne({username: req.body.useridentifier}).exec()
        .then(function (userDoc) {
            if (userDoc) {
                return userDoc;
            }
        
            return userModel.findOne({email: req.body.useridentifier}).exec();
        })
        .then(function (userDoc) {
            if (!userDoc) {
                throw new Error("That username/password combination " +  
                                "does not exist");   
            }
            
            var userInfo = userDoc.toObject(), 
                tokenPayload = lodash.pick(userInfo, ['_id', 
                                                      'username', 
                                                      'permissions', 
                                                      'email']);
            apiView(res, {
                status: 200,
                message: "Succesfully authenticated!",
                data: lodash.merge({
                    authToken: authToken.generate(tokenPayload)
                }, userInfo)
            });
        })
        .catch(function (error) {
            apiView(res, {
                status: 401,
                message: error.message
            });
        });

}

module.exports = loginController;