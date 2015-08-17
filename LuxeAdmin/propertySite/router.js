"use strict";

var express = require('express'),
    router = express.Router(),
    
    multer = require('multer'),
    upload = multer(require('./uploadSettings')),
    
    createController = require('./createController'),
    getController = require('./getController'),
    editController = require('./editController'),
    invalidateController = require('./invalidateController'),
    deleteController = require('./deleteController');

router.post('/create', upload.fields([
    {name: 'photos', maxCount: 30},
    {name: 'videos', maxCount: 4}
]), createController);
router.get('/:propertySiteId', getController);
router.put('/:propertySiteId', upload.fields(), editController);
router.post('/:propertySiteId/invalidate', invalidateController);
router.post('/:propertySiteId/delete', deleteController);

module.exports = router;