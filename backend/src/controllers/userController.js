const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

exports.createUser = (req, res) => {
    const { first_name, last_name, email, password, phone, gender, address, role } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            logger.error('Error hashing password');
            return res.status(500).json({ message: 'Error hashing password' });
        }

        const newUser = { first_name, last_name, email, password: hashedPassword, phone, gender, address, role };

        userModel.createUser(newUser, (error, results) => {
            if (error) {
                logger.error(`Database error while creating user: ${error.message}`);
                delete error.sqlMessage;
                return res.status(500).json({ message: 'Database error', details: error });
            }
            logger.info(`User created successfully: ${email}`);
            res.status(201).json({ message: 'User created successfully', userId: results.insertId });
        });
    });
};

exports.getUsers = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'created_at DESC';
    const offset = (page - 1) * limit;

    userModel.getUsersWithPagination(limit, offset, sort, (error, results) => {
        if (error) {
            logger.error(`Database error while fetching users: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        res.json({
            page,
            limit,
            users: results.users,
            total: results.total
        });
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;
    console.log(id);
    userModel.getUserById(id, (error, results) => {
        if (error) {
            logger.error(`Database error while fetching user: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.length === 0) {
            logger.warn(`User not found: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    });
}


exports.updateUser = (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, phone, gender, address, role} = req.body;
    logger.info({ first_name, last_name, phone, gender, address, role});
    userModel.updateUser(id, { first_name, last_name, phone, gender, address, role},(error, results) => {
        if (error) {
            logger.error(`Database error while fetching user: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.length === 0) {
            logger.warn(`User not found: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({message: "User update successful", id, payload: req.body});
    });
}

exports.deleteUser = (req, res) => {
    const id = req.params.id;

    userModel.deleteUser(id, (error, results) => {
        if (error) {
            logger.error(`Database error while deleting user: ${error.message}`);
            delete error.sqlMessage;
            return res.status(500).json({ message: 'Database error', details: error });
        }
        if (results.affectedRows === 0) {
            logger.warn(`User not found: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info(`User deleted successfully: ${id}`);
        res.json({ message: 'User deleted successfully' });
    });
};