/**
* Routes for the domain path
* Domain Router handles all of the logic for creating, modifying and 
* removing all domain names and mapping them to our Digital Ocean instance.
* 
* @module LuxeAdmin/domains/router
*/
"use strict";

var router = require('express').Router(),
    loggedInMiddleware = require('../auth/middleware/loggedIn'),
    permittedMiddleware = require('../auth/middleware/permitted'),
    
    createController = require('./createController'),
    getController = require('./getController'),
    editController = require('./editController'),
    deleteController = require('./deleteController');

router.post('/create', [
    loggedInMiddleware,
    permittedMiddleware.domainCreation
], createController);

router.get('/:domainId', [
    loggedInMiddleware,
    permittedMiddleware.domainGet
], getController);

router.put('/:domainId', [
    loggedInMiddleware,
    permittedMiddleware.domainEditing
], editController);

router.delete('/:domainId', [
    loggedInMiddleware,
    permittedMiddleware.domainEditing
], deleteController);

module.exports = router;