/**
* Routes for the propertySite path
* propertySite handles all of the logic for adding a Property and
* creating a corresponding PropertySite.
* 
* @module LuxeAdmin/propertySite/router
*/
"use strict";

var express = require('express'),
    router = express.Router(),
    
    multer = require('multer'),
    upload = multer(require('../uploadSettings')),
    loggedInMiddleware = require('../auth/middleware/loggedIn'),
    permittedMiddleware = require('../auth/middleware/permitted'),
    
    createController = require('./createController'),
    getController = require('./getController'),
    editController = require('./editController'),
    deleteController = require('./deleteController');


router.post('/create', [
    upload.fields([
        {name: 'photoFiles', maxCount: 30},
        {name: 'videoFiles', maxCount: 4}
    ]), 
    loggedInMiddleware,
    permittedMiddleware.propertySiteCreation
], createController);

router.get('/:propertySiteId', [
    loggedInMiddleware,
    permittedMiddleware.propertySiteGet
], getController);

router.put('/:propertySiteId', [
    upload.files([
        {name: 'photoFiles', maxCount: 30},
        {name: 'videoFiles', maxCount: 4}
    ]),
    loggedInMiddleware,
    permittedMiddleware.propertySiteEditing
], editController);

router.delete('/:propertySiteId', [
    loggedInMiddleware,
    permittedMiddleware.propertySiteEditing
], deleteController);


module.exports = router;