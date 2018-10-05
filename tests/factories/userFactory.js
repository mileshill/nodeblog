// Create new user in Mongo.
// Return userId
const moongoose = require('moongoose');
const User = moongoose.model('User');

module.exports = () => {
    return new User({}).save();
};