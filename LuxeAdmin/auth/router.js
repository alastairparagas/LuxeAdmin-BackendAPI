/**
* Routes all of the requests dealing with administration authentication
* @module LuxeAdmin/auth/router
*/
"use strict";

var config = require('../../.config'), 
    
    express = require('express'),
    router = express.Router(),
    
    multer = require('multer'), 
    upload = multer(config.Multer),
    
    loginController = require('./loginController');

router.post('/login', upload.fields(), loginController);

module.exports = router;