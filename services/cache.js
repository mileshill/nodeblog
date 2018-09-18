const mongoose = require('mongoose');

// Get reference to existing exec function on
// default mongoose query
const exec = mongoose.Query.prototype.exec;

// Overridding to implement caching
mongoose.Query.prototype.exec = function () {

    // 'this' is a reference to the current query that is being executed
    //Object.assign(target, original, otherKeys);
    // Using Object.assign prevents the modification of original query
    const key = Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    });

    return exec.apply(this, arguments); // Original untouched exec
}
