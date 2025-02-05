const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
}

module.exports = {requestLogger};