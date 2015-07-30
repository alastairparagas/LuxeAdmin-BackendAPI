"use strict";

var lodash = require('lodash');

function apiView(responseStream, responseOptions) {

    var status = responseOptions && Number(responseOptions.status),
        data = responseOptions.data || {},
        message = responseOptions.message || '',
        responseOutput = {};

    if (status < 200 || status > 499 || isNaN(status)) {
        switch (message.toLowerCase()) {
            case "error":
            case "failure":
                status = 400;
                break;
            default:
                status = 200;
        }
    }

    if (message.length === 0) {
        if (status < 200 || status > 499) {
            message = "Error";
        }
    }

    responseOutput = {};

    if (responseStream.hasOwnProperty('apiView')) {
        lodash.merge(responseOutput, responseStream.apiView);   
    }
    lodash.merge(responseOutput, {
        status: status,
        message: message,
        data: data
    });

    return responseStream
        .status(status)
        .json(responseOutput);

}

module.exports = apiView;