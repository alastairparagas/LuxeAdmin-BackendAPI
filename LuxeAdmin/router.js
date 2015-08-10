/**
* Routes all the requests dealing with administration
* @module LuxeAdmin/router
*/
"use strict";

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),

    config = require('../.config'),

    authRouter = require('./auth/router'),
    propertySiteRouter = require('./propertySite/router'),

    apiViewMiddleware = require('./middleware/apiView'),
    corsMiddleware = require('./middleware/cors'),
    missingMiddleware = require('./middleware/missing');

mongoose.connect(config.Mongoose.connectionUri);
mongoose.set('debug', config.Mongoose.debug);

router.use(apiViewMiddleware);
router.use(corsMiddleware);

router.use('/auth', authRouter);
router.use('/propertySite', propertySiteRouter);

router.use(missingMiddleware);

module.exports = router;