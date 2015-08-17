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
        connectionUri: 'mongodb://admin:test@localhost:27017/luxeAdmin'
    },
    Yelp: {
        consumer_key: 'rKMQQSiqYHrLbV2p2-SjWA',
        consumer_secret: 'yJrslVh2YrZlgum40cjQEi0cpOk',
        token: 'RP_GZX79f8Ecl_6S85F_72SPh4UNW1UX', 
        token_secret: 'DmuTrPBs4dJ-3Bf-ZGejO2iMTlA'
    },
    portNumber: 3000,
    staticFilesPath: '/public',
    templateFilesPath: '/templates',
    sitesFilesPath: '/public/sites',
    uploadPath: '/public/uploads',
    adminAppPath: '/public/app'
};

module.exports = config;