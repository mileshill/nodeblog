const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    await next(); // Executes route handler
    clearHash(req.user.id);
}