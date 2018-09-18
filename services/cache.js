const mongoose = require('mongoose');
const redis = require('redis');
const redisCONFIG = require('../config/dev').redisCONFIG;
const util = require('util');

const client = redis.createClient(redisCONFIG);
client.get = util.promisify(client.get); // Promisify

// Get reference to existing exec function on
// default mongoose query
const exec = mongoose.Query.prototype.exec;

// Overridding to implement caching
mongoose.Query.prototype.exec = async function () {

    // 'this' is a reference to the current query that is being executed
    // Using Object.assign prevents the modification of original query
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));


    // Check redis for existing value
    const cacheValue = await client.get(key);
    if (cacheValue){
        return JSON.parse(cacheValue);
    }

    // Else, issue query and store result
    // Mongoose returns model instances
    const result = await  exec.apply(this, arguments); // Original untouched exec
    
    // Set value in cache
    client.set(key, JSON.stringify(result));
    
    // Return result
    return result;
}
