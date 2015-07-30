"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    
    router = express.Router(),
    
    config = require('../.config'),
    authRouter = require('./auth/router'),
    propertySiteRouter = require('./propertySite/router'),
    corsMiddleware = require('./middleware/cors'),
    missingMiddleware = require('./middleware/missing');

mongoose.connect(config.Mongoose.connectionUri);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use('/auth', authRouter);
router.use('/propertySite', propertySiteRouter);

router.use(missingMiddleware);

module.exports = router;