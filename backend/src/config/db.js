const mysql = require('mysql2');
const logger = require('../utils/logger');

class Database {
    constructor() {
        if (!Database.instance) {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT || 3306
            });

            this.connection.connect((err) => {
                if (err) {
                    logger.error(`Database connection failed: ${err.message}`);
                    process.exit(1);
                }
                logger.info('Connected to MySQL Database');
            });

            Database.instance = this;
        }
        return Database.instance;
    }

    getConnection() {
        return this.connection;
    }
}

const dbInstance = new Database();
module.exports = dbInstance.getConnection();
