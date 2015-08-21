/**
* Configuration settings
*/

'use strict';

var config = {
    apiEndpointUrl: '/api',
    jwtSecret: '',
    Mongoose: {
        debug: true,
        connectionUri: ''
    },
    Yelp: {
        consumer_key: '',
        consumer_secret: '',
        token: '', 
        token_secret: ''
    },
    portNumber: 3000,
    
    /*
        Domain name of the Admin app
    */
    domainName: '',
    
    /*
        Location relative to project root of files that are publicly served
    */
    staticFilesPath: '/public',
    
    /*
        Location relative to project root of files that will be compiled for 
        a PropertySite
    */
    templateFilesPath: '/template',
    
    /*
        Location relative to project root where the PropertySites will be 
        stored. Must nest under staticFilesPath
    */
    sitesFilesPath: '/public/sites',
    
    /*
        Location relative to project root where images/videos for 
        PropertySites are stored. Must nest under staticFilesPath
    */
    uploadPath: '/public/uploads',
    
    /*
        Location relative to project root where the frontend Admin app 
        will be stored and publicly served. The index.html in this folder 
        will be used to route all of that frontend App's routes.
    */
    adminAppPath: '/public/app'
};

module.exports = config;