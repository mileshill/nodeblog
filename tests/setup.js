// JEST loading user models
require('../models/User');

// Connect to the MongoDb instance
const mongoose = require('mongoose');
const KEYS = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(KEYS.mongoURI, { useMongoClient: true });