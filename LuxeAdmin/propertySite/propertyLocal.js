/**
* Finds local businesses/places of interests - restaurants and schools
*
* @module LuxeAdmin/propertySite/propertyLocal
* @param {String} location - Location as relative point of interest
* @returns {Object} Promise
*/
"use strict";

var config = require('../../.config'), 

    async = require('async'), 
    yelp = require('yelp').createClient(config.Yelp);


function propertyLocal(location) {

    function promiseExecutor(resolve, reject) {
        async.waterfall([
            function (callback) {
                // Search for business in Yelp
                yelp.search({
                    term: "food",
                    location: location,
                }, function (error, localData) {
                    if (error) {
                        return callback(error);   
                    }
                    callback(null, localData);
                });   
            },
            function (localData, callback) {
                // Only grab open businesses that have a 4.0 and above
                // rating
                var localBusiness = [];
                
                localData.business
                    .filter(function (local) {
                        return local.rating >= 4.0 && 
                            local.is_closed === false;
                    })
                    .forEach(function (local) {
                        localBusiness.push({
                            name: local.name,
                            address: local.location.address,
                            city: local.location.city,
                            state: local.location.state_code,
                            postalCode: local.location.postal_code,
                            phone: local.phone,
                            category: local.categories.map(
                                function (category) {
                                    return category[0];  
                                }
                            )
                        });
                    });
                
                callback(null, localBusiness);
            },
        ], function (error, localBusiness) {
            if (error) {
                return reject(error);   
            }
            resolve(localBusiness);
        });   
    }

    return new Promise(promiseExecutor);
}

module.exports = propertyLocal;