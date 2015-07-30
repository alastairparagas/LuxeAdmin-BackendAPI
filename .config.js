'use strict';

/**
* staticFilesPath - path relative to the root of this project where the 
*   HTML/CSS/JS and other sorts of files will be served for viewing.
* adminAppPath - path relative to staticFilesPath, where the 
*   admin web app is situated.
*/

var config = {
    apiEndpointUrl: '/api',
    jwtSecret: '',
    Mongoose: {
        debug: true,
        connectionUri: ''
    },
    Multer: {
        dest: '/uploads'
    },
    portNumber: 3000,
    staticFilesPath: '/public',
    adminAppPath: '/app'
};

module.exports = config;