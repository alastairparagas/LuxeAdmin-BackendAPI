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
    upload = multer(require('./uploadSettings')),
    loggedInMiddleware = require('./middleware/loggedIn'),
    permittedMiddleware = require('./middleware/permitted'),
    
    createController = require('./createController'),
    getController = require('./getController'),
    editController = require('./editController'),
    deleteController = require('./deleteController');


router.post('/create', [
    upload.fields([
        {name: 'photos', maxCount: 30},
        {name: 'videos', maxCount: 4}
    ]), 
    loggedInMiddleware,
    permittedMiddleware.propertySiteCreation
], createController);

router.get('/:propertySiteId', [
    loggedInMiddleware,
    permittedMiddleware.propertySiteGet
], getController);

router.put('/:propertySiteId', [
    loggedInMiddleware,
    permittedMiddleware.propertySiteEditing
], upload.fields(), editController);

router.delete('/:propertySiteId', [
    loggedInMiddleware,
    permittedMiddleware.propertySiteEditing
], deleteController);


module.exports = router;