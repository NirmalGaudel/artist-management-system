const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

exports.register = (req, res) => {
    const { first_name, last_name, email, password, phone, gender, address } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            logger.error('Error hashing password');
            return res.status(500).json({ error: 'Error hashing password' });
        }

        const newUser = { first_name, last_name, email, password: hashedPassword, phone, gender, address, role: "super_admin" };

        userModel.createUser(newUser, (error, results) => {
            if (error) {
                logger.error(`Database error while creating user: ${error.message}`);
                delete error.sqlMessage;
                return res.status(500).json({ error: 'Database error', details: error });
            }
            logger.info(`User registered successfully: ${email}`);
            res.status(201).json({ message: 'User created successfully', userId: results.insertId });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    userModel.getUserByEmail(email, (error, results) => {
        if (error || results.length === 0) {
            logger.warn(`Failed login attempt: ${email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            delete user.password;
            if (!isMatch) {
                logger.warn(`Invalid password attempt for user: ${email}`);
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            logger.info(`User logged in: ${email}`);
            res.json({ message: 'Login successful', token, user });
        });
    });
};