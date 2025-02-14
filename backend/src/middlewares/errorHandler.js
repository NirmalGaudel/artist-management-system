const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    
    if (err.name === 'CustomError') {
        return res.status(err.status || 500).json({
            message: err.message,
        });
    }

    return res.status(500).json({
        message: 'Server error: ' + err.message,
    });
};

module.exports = errorHandler;
