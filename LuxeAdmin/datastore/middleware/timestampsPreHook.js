/**
* Handles generating timestamps on a Schema this is used on 
* by using Mongoose's middleware.
* @module LuxeAdmin/datastore/middleware/timestamp
*/
"use strict";

/**
* Mongoose Middleware 'save' Pre-Hook that generates updatedAt and createdAt 
* timestamps on Model save.
* @param {Function} next - Middleware hook callback
*/
function save(next){
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    next();
}

/**
* Mongoose Middleware 'update' Pre-Hook that generates updatedAt timestamp 
* on Document save. This is different from a 'save' Pre-Hook in that the 
* document isn't retrieved from the database, but rather, updated through 
* the native Mongo driver.
*/
function update() {
    this.update({}, {
        $set: {
            updatedAt: Date.now()
        }
    });
}

module.exports = {
    save: save,
    update: update
};