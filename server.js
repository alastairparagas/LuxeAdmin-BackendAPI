"use strict";

var express = require('express'),
    chalk = require('chalk'),
    path = require('path'),

    app = express(),

    luxeAdminRouter = require('./LuxeAdmin/router'),
    config = require('./.config');

app.use(config.apiEndpointUrl, luxeAdminRouter);
app.use(express.static(__dirname + config.staticFilesPath));

app.all('/*', function (req, res) {
    res.sendFile(path.join(__dirname + config.staticFilesPath + 
                           config.adminAppPath + '/index.html'));
});

app.listen(config.portNumber, function () {
    console.log(
        chalk.black.bgYellow("Listening at port " + config.portNumber) 
    );
});