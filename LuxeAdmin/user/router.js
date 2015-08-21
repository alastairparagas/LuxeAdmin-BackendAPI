/**
* Routes for the user path
* user handles all of the logic for creating and managing users
* that use this app
*
* @module LuxeAdmin/user/router
*/
"use strict";

var express = require('express'),
    router = express.Router(),
    
    loggedInMiddleware = require('../auth/middleware/loggedIn'),
    permittedMiddleware = require('../auth/middleware/permitted'),
    
    createController = require('./createController'),
    getController = require('./getController'),
    editController = require('./editController'),
    deleteController = require('./deleteController');

router.post('/create', [
    loggedInMiddleware,
    permittedMiddleware.userCreation
], createController);

router.get('/:userId', [
    loggedInMiddleware,
    permittedMiddleware.userGet
], getController);

router.put('/:userId', [
    loggedInMiddleware,
    permittedMiddleware.userEditing
], editController);

router.delete('/:userId', [
    loggedInMiddleware,
    permittedMiddleware.userEditing
], deleteController);

module.exports = router;