const mongoose = require('mongoose');

// Get reference to existing exec function on
// default mongoose query
const exec = mongoose.Query.prototype.exec;

// Overridding to implement caching
mongoose.Query.prototype.exec = function () {
    console.log('About to run a query!!!');
    return exec.apply(this, arguments); // Original untouched exec
}
