const mongoose = require('mongoose');
const redis = require('redis');
const redisCONFIG = require('../config/dev').redisCONFIG;
const util = require('util');


// Create the Redis client; promisify the hget method for async/await functionality
const client = redis.createClient(redisCONFIG);
client.hget = util.promisify(client.hget); // Promisify

// Get reference to existing exec function on default mongoose query
const exec = mongoose.Query.prototype.exec;

// Toggable cache providing compound keys
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}


// Overridding exec to create caching options
mongoose.Query.prototype.exec = async function () {
    // Don't cache the query
    if(!this.useCache){
        return exec.apply(this, arguments);
    }

    // Safe object copying; will not modify the query object
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // If existing cached value:
    // Apply query model to singleton
    // Map query model to array
    const cacheValue = await client.hget(this.hashKey, key);
    if (cacheValue){
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) 
        ? doc.map(record => new this.model(record))
        : new this.model(doc); 
    }

    // No cached value. Stringify result and return
    const result = await exec.apply(this, arguments); // Original untouched exec
    client.hset(this.hashKey, key, JSON.stringify(result));
    return result;
}
