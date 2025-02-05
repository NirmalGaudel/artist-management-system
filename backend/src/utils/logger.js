const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
    level: 'info', // Default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console({ format: format.colorize() }),
        new transports.File({ filename: path.join(__dirname, '../../logs/app.log') }) // Log file
    ]
});

module.exports = logger;
